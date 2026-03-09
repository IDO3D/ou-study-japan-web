// pages/api/quests.js

const MOCK_QUESTS = [
  {
    id: 'q1',
    title: 'Senso-ji Temple',
    title_jp: '浅草寺',
    description: "Visit Tokyo's oldest temple in Asakusa and try your fortune slip (omikuji). The five-story pagoda is iconic.",
    category: 'Culture',
    points: 500,
    image_url: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&q=80&w=800',
    latitude: 35.7147,
    longitude: 139.7966,
    difficulty: 'easy',
    is_active: true,
  },
  {
    id: 'q2',
    title: 'Shibuya Crossing',
    title_jp: '渋谷スクランブル交差点',
    description: "Cross the world's busiest pedestrian intersection during peak hour. Best viewed from the Starbucks above.",
    category: 'Urban',
    points: 200,
    image_url: 'https://images.unsplash.com/photo-1542051812-f4539618b14a?auto=format&fit=crop&q=80&w=800',
    latitude: 35.6595,
    longitude: 139.7004,
    difficulty: 'easy',
    is_active: true,
  },
  {
    id: 'q3',
    title: 'Order in Japanese',
    title_jp: '日本語で注文する',
    description: 'Complete an entire restaurant order in Japanese. Use the camera translator to prepare your order.',
    category: 'Language',
    points: 350,
    image_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&q=80&w=800',
    latitude: 35.6762,
    longitude: 139.6503,
    difficulty: 'medium',
    is_active: true,
  },
  {
    id: 'q4',
    title: 'Mount Takao Hike',
    title_jp: '高尾山ハイキング',
    description: 'Complete the Takao-san hiking trail. Take the Keio line from Shinjuku for about 50 minutes.',
    category: 'Adventure',
    points: 800,
    image_url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=800',
    latitude: 35.6257,
    longitude: 139.2431,
    difficulty: 'hard',
    is_active: true,
  },
  {
    id: 'q5',
    title: 'Convenience Store Gourmet',
    title_jp: 'コンビニグルメ',
    description: 'Try 5 different 7-Eleven, FamilyMart, or Lawson hot foods. The fried chicken is legendary.',
    category: 'Food',
    points: 250,
    image_url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&q=80&w=800',
    latitude: 35.6762,
    longitude: 139.6503,
    difficulty: 'easy',
    is_active: true,
  },
]

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { query } = require('../../database/db')
      const result = await query('SELECT * FROM quests WHERE is_active = true ORDER BY points DESC')
      return res.status(200).json({ quests: result.rows })
    } catch {
      return res.status(200).json({ quests: MOCK_QUESTS })
    }
  }

  if (req.method === 'POST') {
    // Mark quest complete
    const { questId, userId } = req.body
    return res.status(200).json({ success: true, questId, userId })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
