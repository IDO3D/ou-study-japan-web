// pages/api/restaurants.js — with halal food spots

const MOCK_RESTAURANTS = [
  // ── Standard restaurants ──────────────────
  {
    id: '1', name: 'Gyukatsu Motomura', name_jp: '牛カツもと村',
    category: 'Beef Cutlet', price_jpy: 1600, price_range: '¥¥', rating: 4.9,
    latitude: 35.6617, longitude: 139.7040,
    image_url: 'https://images.unsplash.com/photo-1607301406259-dfb186e15582?auto=format&fit=crop&q=80&w=800',
    description: 'Famous beef cutlet — cook it yourself on a hot stone. No Japanese needed, photo menu.',
    is_student_friendly: true, accepts_suica: false, is_halal: false, distance: 420,
  },
  {
    id: '2', name: 'Ichiran Ramen', name_jp: '一蘭',
    category: 'Ramen', price_jpy: 980, price_range: '¥', rating: 4.8,
    latitude: 35.6598, longitude: 139.6985,
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800',
    description: 'Solo booth ramen — perfect for ordering without Japanese. Tonkotsu broth, custom spice.',
    is_student_friendly: true, accepts_suica: true, is_halal: false, distance: 650,
  },
  {
    id: '3', name: 'Yoshinoya', name_jp: '吉野家',
    category: 'Gyudon', price_jpy: 500, price_range: '¥', rating: 4.3,
    latitude: 35.6591, longitude: 139.7019,
    image_url: 'https://images.unsplash.com/photo-1569398034126-476e3a4af72f?auto=format&fit=crop&q=80&w=800',
    description: 'Budget beef bowl open 24/7. Perfect for late nights and early mornings.',
    is_student_friendly: true, accepts_suica: true, is_halal: false, distance: 280,
  },
  {
    id: '4', name: 'Mos Burger', name_jp: 'モスバーガー',
    category: 'Burger', price_jpy: 750, price_range: '¥', rating: 4.2,
    latitude: 35.6622, longitude: 139.7055,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    description: 'Japanese burger chain with seasonal limited items and teriyaki specials.',
    is_student_friendly: true, accepts_suica: false, is_halal: false, distance: 510,
  },
  {
    id: '5', name: 'Saizeriya', name_jp: 'サイゼリヤ',
    category: 'Italian', price_jpy: 600, price_range: '¥', rating: 4.1,
    latitude: 35.6589, longitude: 139.7003,
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    description: 'Affordable Italian — pasta and drinks under ¥600. Student favourite.',
    is_student_friendly: true, accepts_suica: false, is_halal: false, distance: 180,
  },
  // ── Halal restaurants ─────────────────────
  {
    id: 'h1', name: 'Naritaya Halal Ramen', name_jp: '成田屋ハラールラーメン',
    category: 'Halal Ramen', price_jpy: 1100, price_range: '¥¥', rating: 4.7,
    latitude: 35.7148, longitude: 139.7967,
    image_url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&q=80&w=800',
    description: 'Fully halal-certified ramen near Asakusa. Chicken-based tonkotsu-style broth. English menu available.',
    is_student_friendly: true, accepts_suica: true, is_halal: true,
    halal_cert: 'Japan Halal Association', distance: 1200,
  },
  {
    id: 'h2', name: 'Gyukatsu Saku Halal', name_jp: '牛カツさく ハラール',
    category: 'Halal Beef', price_jpy: 1800, price_range: '¥¥', rating: 4.6,
    latitude: 35.6896, longitude: 139.7006,
    image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800',
    description: 'Halal beef cutlet restaurant in Shinjuku. All meat is halal-certified. Popular with Muslim tourists.',
    is_student_friendly: true, accepts_suica: false, is_halal: true,
    halal_cert: 'Muslim Pro Verified', distance: 850,
  },
  {
    id: 'h3', name: 'Magal Korean BBQ Halal', name_jp: 'マガル韓国BBQ ハラール',
    category: 'Halal BBQ', price_jpy: 2200, price_range: '¥¥¥', rating: 4.5,
    latitude: 35.6634, longitude: 139.7001,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    description: 'Korean BBQ with full halal certification. All-you-can-eat option available. Shibuya area.',
    is_student_friendly: false, accepts_suica: false, is_halal: true,
    halal_cert: 'Japan Islamic Trust', distance: 950,
  },
  {
    id: 'h4', name: 'Curry House CoCo Halal', name_jp: 'カレーハウスCoCo壱番屋 ハラール',
    category: 'Halal Curry', price_jpy: 900, price_range: '¥', rating: 4.4,
    latitude: 35.6812, longitude: 139.7671,
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    description: 'CoCo Ichibanya halal branch near Akihabara. Japanese curry with adjustable spice level 1–10.',
    is_student_friendly: true, accepts_suica: true, is_halal: true,
    halal_cert: 'CoCo Halal Certified Branch', distance: 700,
  },
  {
    id: 'h5', name: 'Marugame Seimen Halal', name_jp: '丸亀製麺 ハラール店',
    category: 'Halal Udon', price_jpy: 680, price_range: '¥', rating: 4.3,
    latitude: 35.6599, longitude: 139.7285,
    image_url: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&q=80&w=800',
    description: 'Halal udon noodles made fresh daily. Tempura toppings available. Affordable and filling.',
    is_student_friendly: true, accepts_suica: true, is_halal: true,
    halal_cert: 'Halal Media Japan', distance: 1100,
  },
  {
    id: 'h6', name: 'Yakitori Halal Ginza', name_jp: 'やきとり ハラール 銀座',
    category: 'Halal Yakitori', price_jpy: 1500, price_range: '¥¥', rating: 4.5,
    latitude: 35.6717, longitude: 139.7649,
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    description: 'Traditional yakitori (grilled chicken skewers) with halal certification. Sake-free cooking broth.',
    is_student_friendly: false, accepts_suica: false, is_halal: true,
    halal_cert: 'JHFA Certified', distance: 1600,
  },
]

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { category, max_price, student_friendly, halal_only } = req.query

  try {
    let restaurants = MOCK_RESTAURANTS

    // Try DB first — fall through on any error
    try {
      const { query } = require('../../database/db')
      let sql = 'SELECT * FROM restaurants WHERE 1=1'
      const params = []
      if (category)         { sql += ` AND category ILIKE $${params.length+1}`; params.push(`%${category}%`) }
      if (max_price)        { sql += ` AND price_jpy <= $${params.length+1}`; params.push(parseInt(max_price)) }
      if (student_friendly === 'true') sql += ' AND is_student_friendly = true'
      if (halal_only === 'true')       sql += ' AND is_halal = true'
      sql += ' ORDER BY rating DESC LIMIT 30'
      const result = await query(sql, params)
      if (result.rows.length > 0) restaurants = result.rows
    } catch (_) { /* use mock */ }

    // Client-side filtering on mock
    if (category)               restaurants = restaurants.filter(r => r.category.toLowerCase().includes(category.toLowerCase()))
    if (max_price)              restaurants = restaurants.filter(r => r.price_jpy <= parseInt(max_price))
    if (student_friendly === 'true') restaurants = restaurants.filter(r => r.is_student_friendly)
    if (halal_only === 'true')  restaurants = restaurants.filter(r => r.is_halal)

    return res.status(200).json({ restaurants, total: restaurants.length })
  } catch (err) {
    console.error('Restaurants error:', err)
    return res.status(200).json({ restaurants: MOCK_RESTAURANTS, total: MOCK_RESTAURANTS.length })
  }
}
