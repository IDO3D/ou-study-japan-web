// pages/api/translate.js
// Translates Japanese text using DeepL API

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, targetLang = 'EN' } = req.body

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing text parameter' })
  }

  try {
    // If no DeepL key, use mock translation for demo
    if (!process.env.DEEPL_API_KEY || process.env.DEEPL_API_KEY === 'your_deepl_api_key_here') {
      return res.status(200).json(getMockTranslation(text))
    }

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        source_lang: 'JA',
        target_lang: targetLang,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`)
    }

    const data = await response.json()
    const translated = data.translations?.[0]?.text || ''

    return res.status(200).json({
      original: text,
      translated,
      sourceLang: 'JA',
      targetLang,
      script: detectScript(text),
      romanization: getRomanization(text),
    })
  } catch (error) {
    console.error('Translation error:', error)
    // Fallback to mock
    return res.status(200).json(getMockTranslation(text))
  }
}

function detectScript(text) {
  if (/[\u4E00-\u9FFF]/.test(text)) return 'kanji'
  if (/[\u3040-\u309F]/.test(text)) return 'hiragana'
  if (/[\u30A0-\u30FF]/.test(text)) return 'katakana'
  return 'romaji'
}

function getRomanization(text) {
  const map = {
    'ラーメン': 'Ramen',
    'すし': 'Sushi',
    '寿司': 'Sushi',
    'てんぷら': 'Tempura',
    '天ぷら': 'Tempura',
    'うどん': 'Udon',
    'そば': 'Soba',
    'やきとり': 'Yakitori',
    '焼き鳥': 'Yakitori',
    'カレー': 'Curry',
    '牛丼': 'Gyudon',
    '定食': 'Teishoku (Set Meal)',
    '日替わり': 'Daily Special',
    '本日': 'Today',
    'おすすめ': 'Recommendation',
    'メニュー': 'Menu',
    '出口': 'Exit',
    '入口': 'Entrance',
    'トイレ': 'Toilet/Restroom',
    '無料': 'Free',
  }
  return map[text] || null
}

function getMockTranslation(text) {
  const mockDB = {
    'ラーメン': { translated: 'Ramen (Japanese noodle soup)', romanization: 'Raamen' },
    'すし': { translated: 'Sushi', romanization: 'Sushi' },
    '寿司': { translated: 'Sushi (vinegared rice with toppings)', romanization: 'Sushi' },
    'てんぷら': { translated: 'Tempura (battered and deep-fried seafood/vegetables)', romanization: 'Tenpura' },
    '天ぷら': { translated: 'Tempura (battered and deep-fried seafood/vegetables)', romanization: 'Tenpura' },
    'うどん': { translated: 'Udon (thick wheat noodles)', romanization: 'Udon' },
    'そば': { translated: 'Soba (buckwheat noodles)', romanization: 'Soba' },
    'やきとり': { translated: 'Yakitori (grilled chicken skewers)', romanization: 'Yakitori' },
    '焼き鳥': { translated: 'Yakitori (grilled chicken skewers)', romanization: 'Yakitori' },
    'カレー': { translated: 'Japanese Curry', romanization: 'Karee' },
    '牛丼': { translated: 'Gyudon (beef rice bowl)', romanization: 'Gyuudon' },
    '定食': { translated: 'Teishoku (Japanese set meal with rice, miso, and sides)', romanization: 'Teishoku' },
    '日替わり': { translated: 'Daily Special', romanization: 'Higawari' },
    '本日': { translated: 'Today', romanization: 'Honjitsu' },
    'おすすめ': { translated: 'Recommended / Our Specialty', romanization: 'Osusume' },
    'メニュー': { translated: 'Menu', romanization: 'Menyuu' },
    '出口': { translated: 'Exit', romanization: 'Deguchi' },
    '入口': { translated: 'Entrance', romanization: 'Iriguchi' },
    'トイレ': { translated: 'Toilet / Restroom', romanization: 'Toire' },
    '無料': { translated: 'Free of charge', romanization: 'Muryou' },
    '駅': { translated: 'Train Station', romanization: 'Eki' },
    '電車': { translated: 'Train', romanization: 'Densha' },
  }

  const match = mockDB[text.trim()]
  return {
    original: text,
    translated: match?.translated || `[Translation of: ${text}] — Configure DeepL API key for real translations`,
    sourceLang: 'JA',
    targetLang: 'EN',
    script: detectScript(text),
    romanization: match?.romanization || getRomanization(text),
  }
}
