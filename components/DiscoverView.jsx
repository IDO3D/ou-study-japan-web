import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'ramen', label: 'Ramen', icon: '🍜' },
  { id: 'sushi', label: 'Sushi', icon: '🍣' },
  { id: 'convenience', label: 'Conbini', icon: '🏪' },
  { id: 'halal', label: 'Halal', icon: '☪️' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'izakaya', label: 'Izakaya', icon: '🏮' },
]

const RESTAURANTS = [
  {
    id: 1, name: 'Ichiran Ramen', category: 'ramen', city: 'kyoto',
    lat: 35.0048, lng: 135.7684,
    rating: 4.8, reviews: 2341, priceRange: '¥890–¥1,500',
    avgPrice: 890, halal: false, vegan: false,
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&q=80&w=600',
    description: 'Solo dining booths, ultra-rich tonkotsu broth. Customize your bowl exactly how you want it.',
    tags: ['Tonkotsu', 'Solo Booth', 'Late Night'],
    hours: '11am–3am', waitTime: '15 min',
    menuItems: [
      { name: 'Tonkotsu Ramen', price: '¥890', popular: true, img: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=150&q=80' },
      { name: 'Extra Noodles (Kaedama)', price: '¥110', popular: false },
      { name: 'Seasoned Eggs', price: '¥130', popular: true },
    ],
    menuUrl: 'https://ichiran.com/foreign/en.html',
  },
  {
    id: 2, name: 'Sushiro Conveyor Belt', category: 'sushi', city: 'ibaraki',
    lat: 34.8082, lng: 135.5737,
    rating: 4.4, reviews: 12400, priceRange: '¥110+ /plate',
    avgPrice: 330, halal: false, vegan: false,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=600',
    description: 'Japan\'s most popular kaiten-zushi chain. Order on tablet, pay by plate color. Budget-friendly and delicious.',
    tags: ['Budget', 'Touch Screen', 'Family Friendly'],
    hours: '11am–10pm', waitTime: '30 min',
    menuItems: [
      { name: 'Salmon Nigiri (2pc)', price: '¥110', popular: true, img: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&w=150&q=80' },
      { name: 'Tuna Toro (2pc)', price: '¥330', popular: true },
      { name: 'Shrimp Tempura Roll', price: '¥220', popular: false },
    ],
    menuUrl: 'https://www.akindo-sushiro.co.jp/en/',
  },
  {
    id: 3, name: '7-Eleven Japan', category: 'convenience', city: 'ibaraki',
    lat: 34.8149, lng: 135.5710,
    rating: 4.7, reviews: 88420, priceRange: '¥100–¥600',
    avgPrice: 280, halal: false, vegan: false,
    image: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?auto=format&fit=crop&q=80&w=600',
    description: 'World-class convenience food. Fresh meals, onigiri, hot fried chicken, and ATM services.',
    tags: ['24/7', 'ATM', 'Hot Food', 'Budget'],
    hours: '24 hours', waitTime: '0 min',
    menuItems: [
      { name: 'Tuna Mayo Onigiri', price: '¥130', popular: true, img: 'https://images.unsplash.com/photo-1534604973900-c4309b6851d9?auto=format&fit=crop&w=150&q=80' },
      { name: 'Hot Chicken (Karaage)', price: '¥180', popular: true },
    ],
    menuUrl: 'https://www.sej.co.jp/in/en.html',
  },
  {
    id: 4, name: 'FamilyMart', category: 'convenience', city: 'kyoto',
    lat: 35.0110, lng: 135.7680,
    rating: 4.5, reviews: 12000, priceRange: '¥100–¥600',
    avgPrice: 250, halal: false, vegan: false,
    image: 'https://images.unsplash.com/photo-1542051812-f4539618b14a?auto=format&fit=crop&q=80&w=600',
    description: 'Famous for "FamiChiki" (boneless fried chicken) and excellent pastries. Essential stop.',
    tags: ['24/7', 'FamiChiki', 'ATM'],
    hours: '24 hours', waitTime: '0 min',
    menuItems: [
      { name: 'FamiChiki', price: '¥220', popular: true, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=150&q=80' },
      { name: 'Egg Sandwich', price: '¥280', popular: true },
    ],
    menuUrl: 'https://www.family.co.jp/english.html',
  },
  {
    id: 5, name: 'Lawson', category: 'convenience', city: 'tokyo',
    lat: 35.6760, lng: 139.6500,
    rating: 4.6, reviews: 15000, priceRange: '¥100–¥600',
    avgPrice: 300, halal: false, vegan: false,
    image: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&q=80&w=600',
    description: 'The best convenience store desserts. Look out for the "Uchi Café" sweets line.',
    tags: ['24/7', 'Desserts', 'Karaage-kun'],
    hours: '24 hours', waitTime: '0 min',
    menuItems: [
      { name: 'Karaage-kun (Chicken)', price: '¥238', popular: true, img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=150&q=80' },
      { name: 'Premium Swiss Roll', price: '¥160', popular: true },
    ],
    menuUrl: 'https://www.lawson.co.jp/company/lang/en/',
  },
  {
    id: 6, name: 'Halal Ramen Honolu', category: 'halal', city: 'kyoto',
    lat: 35.0090, lng: 135.7620,
    rating: 4.7, reviews: 892, priceRange: '¥950–¥1,400',
    avgPrice: 1050, halal: true, vegan: false,
    image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=600',
    description: 'Kyoto\'s best halal ramen shop. 100% halal certified with rich chicken broth.',
    tags: ['Halal Certified', 'English Menu'],
    hours: '11:30am–9pm', waitTime: '15 min',
    menuItems: [
      { name: 'Halal Chicken Ramen', price: '¥950', popular: true, img: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?auto=format&fit=crop&w=150&q=80' },
      { name: 'Halal Gyoza', price: '¥380', popular: true },
    ],
    menuUrl: 'http://halalramen-honolu.net/',
  },
  {
    id: 7, name: 'Vegan Ramen Shinjuku', category: 'vegan', city: 'tokyo',
    lat: 35.6905, lng: 135.6995,
    rating: 4.6, reviews: 650, priceRange: '¥980–¥1,400',
    avgPrice: 1050, halal: false, vegan: true,
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&q=80&w=600',
    description: '100% plant-based ramen using rich mushroom and kombu broth. Popular with students.',
    tags: ['100% Vegan', 'Mushroom Broth'],
    hours: '11am–9pm', waitTime: '10 min',
    menuItems: [
      { name: 'Vegan Shoyu Ramen', price: '¥980', popular: true, img: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=150&q=80' },
    ],
    menuUrl: 'https://www.shinjuku-vegan.com/',
  },
]

function RestaurantCard({ r, onSelect, selected, onNavigateToMap }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col cursor-pointer transition-transform hover:scale-[1.02] relative" onClick={() => onSelect(selected ? null : r)} style={{ background: 'var(--surface)' }}>
      {/* Image */}
      <div className="relative aspect-[4/3] w-full">
        <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {r.halal && <span className="px-2 py-1 rounded-full text-[10px] font-display font-bold bg-green-500 text-white shadow-md">☪️ HALAL</span>}
          {r.vegan && <span className="px-2 py-1 rounded-full text-[10px] font-display font-bold bg-emerald-500 text-white shadow-md">🌱 VEGAN</span>}
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-display font-bold text-black bg-white shadow-md">
          {r.priceRange}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-display font-black text-lg text-black m-0 leading-tight" style={{ color: 'var(--text)' }}>{r.name}</h3>
          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-md">
            <span className="text-yellow-600 text-[10px]">★</span>
            <span className="text-yellow-800 text-xs font-bold">{r.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-body" style={{ color: 'var(--text-muted)' }}>
          <span>⏱ {r.waitTime}</span>
          <span>•</span>
          <span>🕐 {r.hours}</span>
          <span>•</span>
          <span className="capitalize font-semibold text-brand">{r.city}</span>
        </div>
        <div className="mt-3 flex gap-1.5 flex-wrap">
          {r.tags.map(t => (
            <span key={t} className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-body font-medium text-gray-600" style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}>{t}</span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100 relative" style={{ borderColor: 'var(--border)' }}>

            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); onSelect(null); }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 text-gray-500"
                style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 pt-10">
              <p className="text-sm text-gray-600 leading-relaxed font-body m-0" style={{ color: 'var(--text-muted)' }}>{r.description}</p>

              {/* Menu Section */}
              <div>
                <h4 className="text-xs font-display font-bold uppercase tracking-wide text-gray-400 mb-2">Popular Menu</h4>
                <div className="grid grid-cols-1 gap-2">
                  {r.menuItems.map(item => (
                    <div key={item.name} className="flex gap-3 p-2 rounded-xl bg-gray-50 items-center border border-gray-100" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                      {item.img ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 text-xl">🍽️</div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 m-0" style={{ color: 'var(--text)' }}>{item.name}</p>
                        <p className="text-xs text-brand font-semibold m-0 mt-0.5">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-5 mb-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onNavigateToMap({ name: r.name, lat: r.lat, lng: r.lng, icon: r.category === 'convenience' ? '🏪' : '🍽️' }) }}
                  className="flex-[2] py-3.5 px-4 rounded-xl font-display font-bold text-[13px] text-white text-center shadow-lg active:scale-95 transition-transform"
                  style={{ background: 'var(--brand)' }}
                >
                  📍 Route Me
                </button>
                {r.menuUrl && (
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(r.menuUrl, '_blank') }}
                    className="flex-[1] py-3.5 px-4 rounded-xl font-display font-bold text-[13px] text-center border active:scale-95 transition-transform"
                    style={{ background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' }}
                  >
                    📋 Menu
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function DiscoverView({ onNavigateToMap }) {
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

  return (
    <div className="min-h-full pb-20" style={{ background: 'var(--bg)' }}>

      {/* Search Header */}
      <div className="sticky top-0 z-20 pt-2 px-5 pb-3" style={{ background: 'var(--bg)' }}>
        <div className="relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search ramen, convenience, sushi..."
            className="w-full py-3.5 pl-12 pr-4 rounded-full font-body text-sm shadow-[0_2px_15px_rgba(0,0,0,0.06)] border border-gray-100"
            style={{ background: 'var(--surface)', color: 'var(--text)' }}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">🔍</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pb-4">
        <div className="flex gap-2 overflow-x-auto hide-scroll pb-2">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[64px] transition-opacity"
              style={{ opacity: activeCategory === c.id ? 1 : 0.5 }}>
              <span className="text-2xl mb-1 bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center shadow-sm border border-gray-50" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>{c.icon}</span>
              <span className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-5 space-y-5">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-display font-black m-0" style={{ color: 'var(--text)' }}>Local Spots</h2>
          <select value={activeCity} onChange={e => setActiveCity(e.target.value)} className="bg-transparent text-sm font-semibold text-brand border-none outline-none cursor-pointer">
            {cities.map(c => <option key={c} value={c} className="text-black">{c === 'all' ? 'All Cities' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl block mb-2 opacity-50">🧭</span>
            <p className="font-body text-gray-500 m-0">No places found matching your scan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} r={r} selected={selected?.id === r.id} onSelect={setSelected} onNavigateToMap={onNavigateToMap} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
