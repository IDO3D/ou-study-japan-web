// pages/api/ai-translate.js — OpenAI Japanese Translation Agent
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end()

    const { text, mode = 'translate', imageBase64 } = req.body
    if (!text && !imageBase64) return res.status(400).json({ error: 'No input provided' })

    const OPENAI_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_KEY) return res.status(500).json({ error: 'OpenAI key not configured' })

    try {
        let messages = []

        const systemPrompt = `You are an expert Japanese language assistant for OU study abroad students in Japan.
Your role:
- Translate Japanese ↔ English accurately and naturally
- Provide pronunciation (romaji) for Japanese text
- Add cultural context when relevant
- For menu items: include price context, allergen notes if visible
- For signs/instructions: add practical guidance for the student
- Keep responses concise and useful for a traveler
Always respond in JSON: { "translation": "...", "romaji": "...", "original": "...", "context": "...", "language_detected": "ja|en" }`

        if (mode === 'image' && imageBase64) {
            messages = [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Please translate and explain all Japanese text visible in this image. If it is a menu, identify items and prices.' },
                        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: 'high' } }
                    ]
                }
            ]
        } else {
            messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Translate this text: "${text}"` }
            ]
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: mode === 'image' ? 'gpt-4o' : 'gpt-4o-mini',
                messages,
                max_tokens: 500,
                temperature: 0.3,
                response_format: { type: 'json_object' },
            }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error?.message || 'OpenAI error')

        const result = JSON.parse(data.choices[0].message.content)
        return res.status(200).json(result)

    } catch (err) {
        console.error('AI Translate error:', err)
        return res.status(500).json({ error: err.message || 'Translation failed' })
    }
}
