// pages/api/restaurants.js

// Mock data fallback when DB isn't available
const MOCK_RESTAURANTS = [
  {
    id: '1',
    name: 'Gyukatsu Motomura',
    name_jp: '牛カツもと村',
    category: 'Beef Cutlet',
    price_jpy: 1600,
    price_range: '¥¥',
    rating: 4.9,
    latitude: 35.6617,
    longitude: 139.704,
    image_url: 'https://images.unsplash.com/photo-1607301406259-dfb186e15582?auto=format&fit=crop&q=80&w=800',
    description: 'Famous beef cutlet — you cook it yourself on a hot stone',
    is_student_friendly: true,
    accepts_suica: false,
    distance: 420,
  },
  {
    id: '2',
    name: 'Ichiran Ramen',
    name_jp: '一蘭',
    category: 'Ramen',
    price_jpy: 980,
    price_range: '¥',
    rating: 4.8,
    latitude: 35.6598,
    longitude: 139.6985,
    image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
    description: 'Solo dining booth ramen — perfect for ordering without Japanese',
    is_student_friendly: true,
    accepts_suica: true,
    distance: 650,
  },
  {
    id: '3',
    name: 'Yoshinoya',
    name_jp: '吉野家',
    category: 'Gyudon',
    price_jpy: 500,
    price_range: '¥',
    rating: 4.3,
    latitude: 35.6591,
    longitude: 139.7019,
    image_url: 'https://images.unsplash.com/photo-1569398034126-476e3a4af72f?auto=format&fit=crop&q=80&w=800',
    description: 'Budget beef bowl — open 24/7, perfect for late nights',
    is_student_friendly: true,
    accepts_suica: true,
    distance: 280,
  },
  {
    id: '4',
    name: 'Mos Burger',
    name_jp: 'モスバーガー',
    category: 'Burger',
    price_jpy: 750,
    price_range: '¥',
    rating: 4.2,
    latitude: 35.6622,
    longitude: 139.7055,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    description: 'Japanese burger chain with seasonal limited items',
    is_student_friendly: true,
    accepts_suica: false,
    distance: 510,
  },
  {
    id: '5',
    name: 'Saizeriya',
    name_jp: 'サイゼリヤ',
    category: 'Italian',
    price_jpy: 600,
    price_range: '¥',
    rating: 4.1,
    latitude: 35.6589,
    longitude: 139.7003,
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    description: 'Cheap Italian — pasta and wine for less than ¥600!',
    is_student_friendly: true,
    accepts_suica: false,
    distance: 180,
  },
]

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { category, max_price, student_friendly } = req.query

  try {
    // Try DB first
    let restaurants
    try {
      const { query } = require('../../database/db')
      let sql = 'SELECT * FROM restaurants WHERE 1=1'
      const params = []

      if (category) { sql += ` AND category ILIKE $${params.length + 1}`; params.push(`%${category}%`) }
      if (max_price) { sql += ` AND price_jpy <= $${params.length + 1}`; params.push(parseInt(max_price)) }
      if (student_friendly === 'true') { sql += ' AND is_student_friendly = true' }

      sql += ' ORDER BY rating DESC LIMIT 20'
      const result = await query(sql, params)
      restaurants = result.rows
    } catch (dbErr) {
      // DB unavailable — use mock
      restaurants = MOCK_RESTAURANTS
    }

    // Filter mock data if DB unavailable
    if (restaurants === MOCK_RESTAURANTS) {
      if (category) restaurants = restaurants.filter(r => r.category.toLowerCase().includes(category.toLowerCase()))
      if (max_price) restaurants = restaurants.filter(r => r.price_jpy <= parseInt(max_price))
    }

    return res.status(200).json({ restaurants, total: restaurants.length })
  } catch (error) {
    console.error('Restaurants API error:', error)
    return res.status(200).json({ restaurants: MOCK_RESTAURANTS, total: MOCK_RESTAURANTS.length })
  }
}
