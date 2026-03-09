// components/DiscoverView.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../utils/store'
import { formatJpy, formatUsd, jpyToUsd } from '../utils/helpers'

const CATEGORIES = ['All', 'Ramen', 'Sushi', 'Beef', 'Burger', 'Italian', 'Gyudon']
const BUDGET_FILTERS = [
  { label: 'Any', max: Infinity },
  { label: 'Under ¥500', max: 500 },
  { label: 'Under ¥1000', max: 1000 },
  { label: 'Under ¥2000', max: 2000 },
]

export default function DiscoverView() {
  const { restaurants, exchangeRate } = useStore()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [budgetFilter, setBudgetFilter] = useState(Infinity)

  const filtered = restaurants.filter((r) => {
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category?.toLowerCase().includes(search.toLowerCase())
    const matchCat =
      activeCategory === 'All' ||
      r.category?.toLowerCase().includes(activeCategory.toLowerCase()) ||
      r.name.toLowerCase().includes(activeCategory.toLowerCase())
    const matchBudget = r.price_jpy <= budgetFilter
    return matchSearch && matchCat && matchBudget
  })

  return (
    <div className="space-y-5 pb-6">
      {/* ── Search Bar ───────────────────────── */}
      <div className="px-5">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span className="text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants..."
            className="bg-transparent flex-1 text-sm font-body text-white placeholder-white/30 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-white/40 text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Category Chips ───────────────────── */}
      <div className="flex gap-2.5 px-5 overflow-x-auto hide-scroll">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-display font-bold transition-all active:scale-95 ${
              activeCategory === cat
                ? 'text-white'
                : 'text-white/40'
            }`}
            style={{
              background:
                activeCategory === cat
                  ? '#E02424'
                  : 'rgba(255,255,255,0.07)',
              border:
                activeCategory === cat
                  ? '1px solid rgba(224,36,36,0.5)'
                  : '1px solid rgba(255,255,255,0.08)',
              boxShadow: activeCategory === cat ? '0 4px 12px rgba(224,36,36,0.3)' : 'none',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Budget Filter ────────────────────── */}
      <div className="flex gap-2 px-5 overflow-x-auto hide-scroll">
        {BUDGET_FILTERS.map((bf) => (
          <button
            key={bf.label}
            onClick={() => setBudgetFilter(bf.max)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-display font-bold transition-all active:scale-95`}
            style={{
              background: budgetFilter === bf.max ? 'rgba(91,138,94,0.2)' : 'rgba(255,255,255,0.05)',
              border: budgetFilter === bf.max ? '1px solid rgba(91,138,94,0.4)' : '1px solid rgba(255,255,255,0.07)',
              color: budgetFilter === bf.max ? '#86efac' : 'rgba(255,255,255,0.35)',
            }}
          >
            {bf.label}
          </button>
        ))}
      </div>

      {/* ── Results ──────────────────────────── */}
      <div className="px-5 space-y-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🍜</p>
            <p className="font-display font-bold text-white">No restaurants found</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 28 }}
              className="flex gap-4 p-4 rounded-3xl active:scale-[0.98] transition-transform cursor-pointer"
              style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Image */}
              <div className="flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden">
                <img
                  src={r.image_url}
                  alt={r.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h4 className="font-display font-bold text-white text-sm leading-tight">{r.name}</h4>
                      {r.name_jp && (
                        <p className="font-jp text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.name_jp}</p>
                      )}
                    </div>
                    <span
                      className="flex-shrink-0 flex items-center gap-1 text-xs font-display font-bold"
                      style={{ color: '#FCD34D' }}
                    >
                      ★ {r.rating}
                    </span>
                  </div>
                  <p className="text-xs mt-1.5 leading-snug line-clamp-2"
                    style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {r.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display font-black text-white">{formatJpy(r.price_jpy)}</span>
                    <span className="text-xs ml-1.5 font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      ≈ ${jpyToUsd(r.price_jpy, exchangeRate)}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {r.is_student_friendly && (
                      <span className="badge badge-green text-[9px]">👨‍🎓</span>
                    )}
                    {r.accepts_suica && (
                      <span className="badge badge-blue text-[9px]">Suica</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
