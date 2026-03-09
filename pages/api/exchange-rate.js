// pages/api/exchange-rate.js
// Fetches live JPY/USD exchange rate

let cachedRate = null
let cacheTime = null
const CACHE_TTL = 3600000 // 1 hour

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Return cached rate if fresh
  if (cachedRate && cacheTime && Date.now() - cacheTime < CACHE_TTL) {
    return res.status(200).json({ rate: cachedRate, cached: true, timestamp: cacheTime })
  }

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY || process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY

    if (!apiKey || apiKey === 'your_exchange_rate_key_here') {
      // Use a reasonable fallback rate
      return res.status(200).json({
        rate: 0.0067,
        cached: false,
        fallback: true,
        note: 'Using fallback rate. Add EXCHANGE_RATE_API_KEY to .env.local',
      })
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/pair/JPY/USD`
    )

    if (!response.ok) throw new Error(`Exchange API error: ${response.status}`)

    const data = await response.json()
    const rate = data.conversion_rate

    // Cache the result
    cachedRate = rate
    cacheTime = Date.now()

    return res.status(200).json({ rate, cached: false, timestamp: cacheTime })
  } catch (error) {
    console.error('Exchange rate error:', error)
    return res.status(200).json({
      rate: cachedRate || 0.0067,
      cached: true,
      fallback: true,
    })
  }
}
