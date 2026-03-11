// pages/api/exchange-rate.js
// Fetches live JPY/USD exchange rate with serverless-safe caching

// Note: module-level cache works within a single Lambda execution context.
// Use Vercel KV/Redis for persistent caching in production.
let _rate = null
let _rateTime = 0
const CACHE_TTL = 3600000 // 1 hour in-memory

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  // Serve cached value if fresh (same Lambda instance)
  if (_rate && Date.now() - _rateTime < CACHE_TTL) {
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).json({ rate: _rate, cached: true })
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY
  const FALLBACK = 0.0067

  if (!apiKey) {
    res.setHeader('Cache-Control', 's-maxage=3600')
    return res.status(200).json({ rate: FALLBACK, source: 'fallback', note: 'Add EXCHANGE_RATE_API_KEY to env' })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/pair/JPY/USD`,
      { 
        headers: { 'Accept': 'application/json' }, 
        signal: controller.signal 
      }
    )
    clearTimeout(timeoutId)
    if (!response.ok) throw new Error(`API ${response.status}`)
    const data = await response.json()
    const rate = data.conversion_rate || FALLBACK
    _rate = rate
    _rateTime = Date.now()
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).json({ rate, source: 'live' })
  } catch (err) {
    console.error('Exchange rate fetch failed:', err.message)
    res.setHeader('Cache-Control', 's-maxage=300')
    return res.status(200).json({ rate: _rate || FALLBACK, source: 'fallback' })
  }
}
