// utils/currency.js

/**
 * Convert JPY to USD using a live or cached rate
 * Falls back to approximate rate if API unavailable
 */
export const JPY_TO_USD_FALLBACK = 0.0067 // ~149 JPY per USD

export function jpyToUsd(jpy, rate = JPY_TO_USD_FALLBACK) {
  return (jpy * rate).toFixed(2)
}

export function usdToJpy(usd, rate = JPY_TO_USD_FALLBACK) {
  return Math.round(usd / rate)
}

export function formatJpy(amount) {
  return `¥${Number(amount).toLocaleString('ja-JP')}`
}

export function formatUsd(amount) {
  return `$${Number(amount).toFixed(2)}`
}

export function formatDualCurrency(jpy, rate = JPY_TO_USD_FALLBACK) {
  return {
    jpy: formatJpy(jpy),
    usd: formatUsd(jpyToUsd(jpy, rate)),
  }
}

// utils/japaneseScript.js

/**
 * Detect if a string contains Japanese characters
 * Returns: 'hiragana' | 'katakana' | 'kanji' | 'mixed' | 'romaji'
 */
export function detectJapaneseScript(text) {
  const hiragana = /[\u3040-\u309F]/
  const katakana = /[\u30A0-\u30FF]/
  const kanji = /[\u4E00-\u9FFF\u3400-\u4DBF]/

  const hasHira = hiragana.test(text)
  const hasKata = katakana.test(text)
  const hasKanji = kanji.test(text)

  if (hasKanji && (hasHira || hasKata)) return 'mixed'
  if (hasKanji) return 'kanji'
  if (hasHira) return 'hiragana'
  if (hasKata) return 'katakana'
  return 'romaji'
}

export function isJapanese(text) {
  return detectJapaneseScript(text) !== 'romaji'
}

export function containsJapanese(text) {
  return /[\u3040-\u30FF\u4E00-\u9FFF\u3400-\u4DBF]/.test(text)
}

// utils/geolocation.js

export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Default to Tokyo Shibuya if no geolocation
      resolve({ lat: 35.6595, lng: 139.7004 })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        console.warn('Geolocation error:', err.message)
        resolve({ lat: 35.6595, lng: 139.7004 }) // Default: Shibuya
      },
      {
        timeout: 8000,
        maximumAge: 60000,
        enableHighAccuracy: true,
        ...options,
      }
    )
  })
}

export function distanceBetween(lat1, lon1, lat2, lon2) {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // distance in meters
}

export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

// utils/time.js

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'おはよう' // Ohayou - Good morning
  if (hour < 17) return 'こんにちは' // Konnichiwa - Good afternoon
  return 'こんばんは' // Konbanwa - Good evening
}

export function getGreetingEn() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export function formatJapanTime(date = new Date()) {
  return date.toLocaleTimeString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatJapanDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    timeZone: 'Asia/Tokyo',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

// utils/classnames.js
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
