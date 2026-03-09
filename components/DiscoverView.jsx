// components/DiscoverView.jsx — Rich food discovery with prices, ratings, menus, deals
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'ramen', label: 'Ramen', icon: '🍜' },
  { id: 'sushi', label: 'Sushi', icon: '🍣' },
  { id: 'halal', label: 'Halal', icon: '☪️' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'conveyor', label: 'Conveyor', icon: '🔄' },
  { id: 'izakaya', label: 'Izakaya', icon: '🏮' },
  { id: 'convenience', label: 'Conbini', icon: '🏪' },
]

const RESTAURANTS = [
  {
    id: 1, name: 'Ichiran Ramen', category: 'ramen', city: 'kyoto',
    rating: 4.8, reviews: 2341, priceRange: '¥890–¥1,500',
    avgPrice: 890, halal: false, vegan: false,
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&q=80&w=600',
    description: 'Solo dining booths, ultra-rich tonkotsu broth. No social pressure — perfect for solo travelers.',
    tags: ['Tonkotsu', 'Solo Booth', 'Late Night'],
    hours: '11am–3am', waitTime: '15–25 min',
    deal: '¥100 off extra noodles with app coupon',
    menuItems: [
      { name: 'Tonkotsu Ramen', price: '¥890', popular: true },
      { name: 'Extra Noodles (Kaedama)', price: '¥110', popular: false },
      { name: 'Seasoned Eggs', price: '¥130', popular: true },
    ],
    mapUrl: 'https://maps.google.com/?q=Ichiran+Kyoto',
    menuUrl: 'https://ichiran.com/foreign/en.html',
  },
  {
    id: 2, name: 'Nishiki Market Food Stalls', category: 'sushi', city: 'kyoto',
    rating: 4.6, reviews: 5820, priceRange: '¥200–¥800',
    avgPrice: 400, halal: false, vegan: true,
    image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&q=80&w=600',
    description: 'Kyoto\'s kitchen! Street food stalls for 400+ years — skewers, tofu, pickles, matcha sweets.',
    tags: ['Street Food', 'Market', 'Outdoor', 'Vegan Options'],
    hours: '9am–6pm', waitTime: '0 min',
    deal: 'Free matcha tasting at select stalls',
    menuItems: [
      { name: 'Tamagoyaki (Egg Roll)', price: '¥300', popular: true },
      { name: 'Yakitori Skewer', price: '¥200', popular: true },
      { name: 'Matcha Soft Serve', price: '¥450', popular: true },
      { name: 'Pickled Vegetables', price: '¥200', popular: false },
    ],
    mapUrl: 'https://maps.google.com/?q=Nishiki+Market+Kyoto',
    menuUrl: 'https://www.kyoto-nishiki.or.jp/en/',
  },
  {
    id: 3, name: 'Halal Ramen Honolu', category: 'halal', city: 'kyoto',
    rating: 4.7, reviews: 892, priceRange: '¥950–¥1,400',
    avgPrice: 1050, halal: true, vegan: false,
    image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=600',
    description: 'Kyoto\'s best halal ramen shop. 100% halal certified with English menu available.',
    tags: ['Halal Certified', 'English Menu', 'Chicken Broth'],
    hours: '11:30am–9pm', waitTime: '10–20 min',
    deal: null,
    menuItems: [
      { name: 'Halal Shoyu Ramen', price: '¥980', popular: true },
      { name: 'Halal Chicken Ramen', price: '¥950', popular: true },
      { name: 'Gyoza (Halal)', price: '¥380', popular: true },
    ],
    mapUrl: 'https://maps.google.com/?q=Halal+Ramen+Kyoto',
    menuUrl: null,
  },
  {
    id: 4, name: 'Sushiro Conveyor Belt', category: 'conveyor', city: 'ibaraki',
    rating: 4.4, reviews: 12400, priceRange: '¥110–¥440/plate',
    avgPrice: 330, halal: false, vegan: false,
    image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&q=80&w=600',
    description: 'Japan\'s most popular kaiten-zushi chain. Order on tablet, pay by plate color. Budget-friendly and delicious.',
    tags: ['Conveyor Belt', 'Budget', 'Touch Screen Order', 'Family Friendly'],
    hours: '11am–10pm', waitTime: '30–60 min (no reservation)',
    deal: 'Student discount: 10% off with OU student ID',
    menuItems: [
      { name: 'Salmon Nigiri (2pc)', price: '¥110', popular: true },
      { name: 'Tuna Toro (2pc)', price: '¥330', popular: true },
      { name: 'Shrimp Tempura Roll', price: '¥220', popular: false },
      { name: 'Tamago (Egg) 2pc', price: '¥110', popular: false },
    ],
    mapUrl: 'https://maps.google.com/?q=Sushiro+Ibaraki',
    menuUrl: 'https://www.akindo-sushiro.co.jp/en/',
  },
  {
    id: 5, name: 'Afuri Ramen', category: 'ramen', city: 'tokyo',
    rating: 4.9, reviews: 3210, priceRange: '¥990–¥1,600',
    avgPrice: 1100, halal: false, vegan: true,
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&q=80&w=600',
    description: 'Famous for light yuzu shio ramen. Michelin Bib Gourmand. Vegan option available.',
    tags: ['Yuzu', 'Michelin', 'Vegan Option', 'Harajuku'],
    hours: '11am–10pm', waitTime: '20–40 min',
    deal: null,
    menuItems: [
      { name: 'Yuzu Shio Ramen', price: '¥990', popular: true },
      { name: 'Yuzu Shoyu Ramen', price: '¥990', popular: false },
      { name: 'Vegan Ramen', price: '¥1,100', popular: true },
    ],
    mapUrl: 'https://maps.google.com/?q=Afuri+Ramen+Harajuku',
    menuUrl: 'https://afuri.com/en/',
  },
  {
    id: 6, name: '7-Eleven Japan', category: 'convenience', city: 'ibaraki',
    rating: 4.5, reviews: 88420, priceRange: '¥100–¥600',
    avgPrice: 280, halal: false, vegan: false,
    image: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?auto=format&fit=crop&q=80&w=600',
    description: 'Japan convenience stores are world-class. Hot foods, fresh onigiri, decent coffee, ATM available.',
    tags: ['24/7', 'ATM Inside', 'Hot Food', 'Onigiri', 'Budget'],
    hours: '24 hours', waitTime: '0 min',
    deal: '¥100 hot coffee with any snack purchase',
    menuItems: [
      { name: 'Onigiri (Rice Ball)', price: '¥130', popular: true },
      { name: 'Hot Chicken (Karaage)', price: '¥180', popular: true },
      { name: 'Nikuman (Pork Bun)', price: '¥130', popular: true },
      { name: 'Green Tea', price: '¥140', popular: false },
    ],
    mapUrl: 'https://maps.google.com/?q=7-Eleven+Ibaraki+Osaka',
    menuUrl: null,
  },
  {
    id: 7, name: 'Shibuya Cast Izakaya', category: 'izakaya', city: 'tokyo',
    rating: 4.3, reviews: 1820, priceRange: '¥500–¥2,000',
    avgPrice: 1200, halal: false, vegan: false,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=600',
    description: 'Classic Japanese gastropub experience. Small plates, drinks, social atmosphere. Great for group dinners.',
    tags: ['Group Dining', 'Drinks', 'Late Night', 'Social'],
    hours: '5pm–2am', waitTime: '15 min (reservation recommended)',
    deal: 'Happy hour 5–7pm: ¥200 off all drinks',
    menuItems: [
      { name: 'Edamame', price: '¥300', popular: true },
      { name: 'Gyoza (6pc)', price: '¥480', popular: true },
      { name: 'Draft Beer (Nama)', price: '¥550', popular: true },
      { name: 'Yakitori Set', price: '¥880', popular: false },
    ],
    mapUrl: 'https://maps.google.com/?q=Izakaya+Shibuya+Tokyo',
    menuUrl: null,
  },
  {
    id: 8, name: 'Vegan Ramen Shinjuku', category: 'vegan', city: 'tokyo',
    rating: 4.6, reviews: 650, priceRange: '¥980–¥1,400',
    avgPrice: 1050, halal: false, vegan: true,
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&q=80&w=600',
    description: '100% plant-based ramen using rich mushroom and kombu broth. Popular with international students.',
    tags: ['100% Vegan', 'Mushroom Broth', 'English Menu', 'Instagram-worthy'],
    hours: '11am–9pm', waitTime: '10 min',
    deal: null,
    menuItems: [
      { name: 'Vegan Shoyu Ramen', price: '¥980', popular: true },
      { name: 'Vegan Tsukemen', price: '¥1,100', popular: false },
      { name: 'Vegan Gyoza (4pc)', price: '¥420', popular: true },
    ],
    mapUrl: 'https://maps.google.com/?q=Vegan+Ramen+Shinjuku',
    menuUrl: null,
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: rating >= s ? '#FCD34D' : 'rgba(255,255,255,0.2)', fontSize: 10 }}>★</span>
      ))}
    </div>
  )
}

function RestaurantCard({ r, onSelect, selected }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'var(--surface2)', border: `1px solid ${selected ? 'var(--brand)' : 'var(--border)'}` }}
      onClick={() => onSelect(selected ? null : r)}
    >
      {/* Image */}
      <div className="relative h-36">
        <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1 flex-wrap">
          {r.halal && <span className="px-2 py-0.5 rounded-full text-[9px] font-display font-bold" style={{ background: '#10B981', color: 'white' }}>☪️ HALAL</span>}
          {r.vegan && <span className="px-2 py-0.5 rounded-full text-[9px] font-display font-bold" style={{ background: '#22c55e', color: 'white' }}>🌱 VEGAN</span>}
          {r.deal && <span className="px-2 py-0.5 rounded-full text-[9px] font-display font-bold" style={{ background: '#E02424', color: 'white' }}>🎁 DEAL</span>}
        </div>

        {/* Price */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-display font-bold text-white"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
          {r.priceRange}
        </div>

        {/* Name */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-display font-black text-white leading-tight">{r.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={Math.round(r.rating)} />
            <span className="text-[10px] font-display font-bold" style={{ color: '#FCD34D' }}>{r.rating}</span>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>({r.reviews.toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* Info Row */}
      <div className="px-3 py-2.5 flex items-center gap-2">
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>⏱ {r.waitTime}</span>
        <span style={{ color: 'var(--border)', fontSize: 10 }}>|</span>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>🕐 {r.hours}</span>
        <span className="ml-auto text-[10px] font-display font-bold capitalize px-2 py-0.5 rounded-full"
          style={{ background: 'var(--brand-subtle)', color: 'var(--brand-light)' }}>
          {r.city}
        </span>
      </div>

      {/* Tags */}
      <div className="px-3 pb-2.5 flex gap-1 flex-wrap">
        {r.tags.slice(0, 3).map(t => (
          <span key={t} className="px-2 py-0.5 rounded-full text-[9px] font-display font-semibold"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
            {t}
          </span>
        ))}
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}>
            <div className="p-3 space-y-3">
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{r.description}</p>

              {r.deal && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(224,36,36,0.1)', border: '1px solid rgba(224,36,36,0.2)' }}>
                  <span>🎁</span>
                  <p className="text-xs font-display font-bold" style={{ color: '#FF6B6B' }}>{r.deal}</p>
                </div>
              )}

              {/* Menu */}
              <div>
                <p className="text-[9px] font-display font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  Menu Highlights
                </p>
                <div className="space-y-1">
                  {r.menuItems.map(item => (
                    <div key={item.name} className="flex items-center justify-between py-1" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-1.5">
                        {item.popular && <span className="text-[8px] font-display font-bold text-amber-400">★</span>}
                        <p className="text-xs" style={{ color: 'var(--text)' }}>{item.name}</p>
                      </div>
                      <p className="text-xs font-display font-bold" style={{ color: 'var(--brand-light)' }}>{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <a href={r.mapUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl font-display font-bold text-xs text-white text-center transition-all active:scale-95"
                  style={{ background: 'var(--brand)', boxShadow: '0 4px 12px var(--brand-glow)' }}>
                  📍 Get Directions
                </a>
                {r.menuUrl && (
                  <a href={r.menuUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl font-display font-bold text-xs text-center transition-all active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    📋 Full Menu
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function DiscoverView() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeCity, setActiveCity] = useState('all')
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const cities = ['all', 'ibaraki', 'kyoto', 'tokyo']
  const filtered = RESTAURANTS.filter(r => {
    const matchCat = activeCategory === 'all' || r.category === activeCategory
    const matchCity = activeCity === 'all' || r.city === activeCity
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchCity && matchSearch
  })

  const avgBudget = filtered.length ? Math.round(filtered.reduce((s, r) => s + r.avgPrice, 0) / filtered.length) : 0

  return (
    <div className="px-5 pb-6 space-y-4">

      {/* Header stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Spots', value: filtered.length },
          { label: 'Avg Price', value: `¥${avgBudget}` },
          { label: 'Halal', value: filtered.filter(r => r.halal).length },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-2xl text-center" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
            <p className="font-display font-black text-white text-lg">{s.value}</p>
            <p className="text-[9px] font-display uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search food, cuisine, tags..."
          className="w-full py-3 pl-10 pr-4 rounded-2xl font-body text-sm"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }}
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">🔍</span>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto hide-scroll">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-display font-bold transition-all active:scale-95"
            style={{ background: activeCategory === c.id ? 'var(--brand)' : 'rgba(255,255,255,0.07)', color: activeCategory === c.id ? 'white' : 'rgba(255,255,255,0.45)', border: activeCategory === c.id ? '1px solid var(--brand)' : '1px solid rgba(255,255,255,0.08)' }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* City filter */}
      <div className="flex gap-2">
        {cities.map(c => (
          <button key={c} onClick={() => setActiveCity(c)}
            className="flex-1 py-1.5 rounded-xl text-[10px] font-display font-bold capitalize transition-all active:scale-95"
            style={{ background: activeCity === c ? 'var(--brand-subtle)' : 'rgba(255,255,255,0.05)', color: activeCity === c ? 'var(--brand-light)' : 'var(--text-muted)', border: activeCity === c ? '1px solid var(--brand)' : '1px solid var(--border)' }}>
            {c === 'all' ? 'All Cities' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3">
          <span className="text-4xl">🍽️</span>
          <p className="font-display font-bold" style={{ color: 'var(--text-muted)' }}>No results found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <RestaurantCard r={r} onSelect={setSelected} selected={selected?.id === r.id} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
