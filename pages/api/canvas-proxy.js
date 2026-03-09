// pages/api/canvas-proxy.js — Proxies Canvas LMS API to avoid CORS
export default async function handler(req, res) {
    const { token, path = 'courses' } = req.query
    if (!token) return res.status(400).json({ error: 'No token provided' })

    const allowedPaths = ['courses', 'users/self', 'calendar_events', 'assignments']
    const safePath = allowedPaths.find(p => path.startsWith(p)) ? path : 'courses'

    try {
        const url = `https://canvas.ou.edu/api/v1/${safePath}?enrollment_state=active&per_page=20`
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            // Try alternate OU Canvas URL
            const url2 = `https://ou.instructure.com/api/v1/${safePath}?enrollment_state=active&per_page=20`
            const response2 = await fetch(url2, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
            if (!response2.ok) {
                return res.status(response2.status).json({ error: 'Canvas authentication failed. Check your token.' })
            }
            const data2 = await response2.json()
            return res.status(200).json(data2)
        }

        const data = await response.json()
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({ error: 'Could not reach Canvas. Check your internet connection.' })
    }
}
