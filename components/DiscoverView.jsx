// components/DiscoverView.jsx — Production with Halal filter
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'
import { formatJpy, jpyToUsd } from '../utils/helpers'
import { IcSearch, IcX, IcHalal, IcStar, IcCheck, IcFood, IcPin } from './ui/Icons'

const CATEGORIES = ['All', 'Ramen', 'Sushi', 'Beef', 'Burger', 'Curry', 'Udon', 'Halal']
const BUDGET_FILTERS = [
  { label: 'Any',         max: Infinity },
  { label: 'Under ¥800',  max: 800 },
  { label: 'Under ¥1200', max: 1200 },
  { label: 'Under ¥2000', max: 2000 },
]

const FALLBACK = {
  'Ramen':          'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
  'Beef Cutlet':    'https://images.unsplash.com/photo-1607301406259-dfb186e15582?w=600&q=80',
  'Gyudon':         'https://images.unsplash.com/photo-1569398034126-476e3a4af72f?w=600&q=80',
  'Burger':         'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  'Italian':        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  'Halal Ramen':    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=80',
  'Halal Beef':     'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80',
  'Halal BBQ':      'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  'Halal Curry':    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80',
  'Halal Udon':     'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
  'Halal Yakitori': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  default:          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
}

const safeImg = r => (r?.image_url?.startsWith('http') ? r.image_url : FALLBACK[r?.category] || FALLBACK.default)

export default function DiscoverView() {
  const { restaurants, exchangeRate } = useStore()
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('All')
  const [budget, setBudget]   = useState(Infinity)
  const [halalOnly, setHalal] = useState(false)
  const [detail, setDetail]   = useState(null)

  const filtered = restaurants.filter(r => {
    const s = search.toLowerCase()
    const ok_search = !search || r.name.toLowerCase().includes(s) || r.category?.toLowerCase().includes(s)
    const ok_cat    = cat === 'All' || r.category?.toLowerCase().includes(cat.toLowerCase()) || (cat === 'Halal' && r.is_halal)
    const ok_budget = r.price_jpy <= budget
    const ok_halal  = !halalOnly || r.is_halal
    return ok_search && ok_cat && ok_budget && ok_halal
  })

  const halalCount = restaurants.filter(r => r.is_halal).length

  return (
    <div className="space-y-4 pb-4">

      {/* Search */}
      <div className="px-5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <IcSearch size={16} color="rgba(255,255,255,0.35)" strokeWidth={2} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants..." className="bg-transparent flex-1 text-sm text-white outline-none"
            style={{ '::placeholder': { color: 'rgba(255,255,255,0.28)' } }} />
          {search && <button onClick={() => setSearch('')}><IcX size={14} color="rgba(255,255,255,0.4)" strokeWidth={2.5} /></button>}
        </div>
      </div>

      {/* Halal Toggle */}
      <div className="px-5">
        <button onClick={() => setHalal(v => !v)}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full transition-all active:scale-[0.98]"
          style={{
            background: halalOnly ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
            border: halalOnly ? '1px solid rgba(34,197,94,0.32)' : '1px solid rgba(255,255,255,0.08)',
          }}>
          <IcHalal size={20} color={halalOnly ? '#22c55e' : 'rgba(255,255,255,0.3)'} />
          <div className="flex-1 text-left">
            <p className="font-display font-bold" style={{ fontSize: '12.5px', color: halalOnly ? '#22c55e' : 'rgba(255,255,255,0.6)' }}>
              Halal Certified Only
            </p>
            <p className="font-display" style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.28)' }}>
              {halalCount} halal spots within radius
            </p>
          </div>
          {/* Toggle pill */}
          <div className="w-11 h-6 rounded-full relative transition-colors duration-200"
            style={{ background: halalOnly ? '#22c55e' : 'rgba(255,255,255,0.12)' }}>
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
              style={{ left: halalOnly ? '24px' : '4px' }} />
          </div>
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 px-5 overflow-x-auto hide-scroll">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full font-display font-bold transition-all active:scale-95"
            style={{
              fontSize: '11px',
              background: cat === c ? '#E02424' : 'rgba(255,255,255,0.07)',
              border: cat === c ? '1px solid rgba(224,36,36,0.5)' : '1px solid rgba(255,255,255,0.08)',
              color: cat === c ? 'white' : 'rgba(255,255,255,0.4)',
              boxShadow: cat === c ? '0 3px 10px rgba(224,36,36,0.22)' : 'none',
            }}>
            {c === 'Halal' && <IcHalal size={11} color={cat === c ? 'white' : '#22c55e'} />}
            {c}
          </button>
        ))}
      </div>

      {/* Budget filter */}
      <div className="flex gap-2 px-5 overflow-x-auto hide-scroll">
        {BUDGET_FILTERS.map(bf => (
          <button key={bf.label} onClick={() => setBudget(bf.max)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full font-display font-bold transition-all active:scale-95"
            style={{
              fontSize: '10px',
              background: budget === bf.max ? 'rgba(91,138,94,0.16)' : 'rgba(255,255,255,0.05)',
              border: budget === bf.max ? '1px solid rgba(91,138,94,0.35)' : '1px solid rgba(255,255,255,0.07)',
              color: budget === bf.max ? '#86efac' : 'rgba(255,255,255,0.3)',
            }}>
            {bf.label}
          </button>
        ))}
      </div>

      {/* Results header */}
      <div className="px-5 flex items-center justify-between">
        <span className="font-display" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
        {halalOnly && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.22)' }}>
            <IcHalal size={10} color="#22c55e" />
            <span className="font-display font-bold" style={{ fontSize: '9px', color: '#22c55e' }}>Halal filter active</span>
          </div>
        )}
      </div>

      {/* Restaurant list */}
      <div className="px-5 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <IcFood size={26} color="rgba(255,255,255,0.22)" />
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-white">No restaurants found</p>
              <p className="mt-1" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.36)' }}>Try adjusting your filters</p>
            </div>
          </div>
        ) : filtered.map((r, i) => (
          <motion.button key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.035, type: 'spring', stiffness: 300, damping: 28 }}
            onClick={() => setDetail(detail?.id === r.id ? null : r)}
            className="w-full flex gap-4 p-4 rounded-3xl active:scale-[0.98] transition-transform text-left"
            style={{
              background: 'rgba(18,18,20,0.92)',
              border: detail?.id === r.id
                ? (r.is_halal ? '1px solid rgba(34,197,94,0.28)' : '1px solid rgba(224,36,36,0.22)')
                : '1px solid rgba(255,255,255,0.07)',
            }}>

            {/* Thumbnail */}
            <div className="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden relative">
              <img src={safeImg(r)} alt={r.name} className="w-full h-full object-cover"
                onError={e => { e.target.src = FALLBACK.default }} loading="lazy" />
              {r.is_halal && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
                  <IcHalal size={12} color="#22c55e" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
              <div>
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display font-bold text-white truncate" style={{ fontSize: '13px' }}>{r.name}</h4>
                    {r.name_jp && <p className="font-jp truncate" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.36)' }}>{r.name_jp}</p>}
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-0.5 ml-1">
                    <IcStar size={10} color="#FCD34D" strokeWidth={0} style={{ fill: '#FCD34D' }} />
                    <span className="font-display font-bold" style={{ fontSize: '11px', color: '#FCD34D' }}>{r.rating}</span>
                  </div>
                </div>
                <p className="line-clamp-2 leading-snug mt-1.5" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.42)' }}>
                  {r.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-black text-white" style={{ fontSize: '14px' }}>{formatJpy(r.price_jpy)}</span>
                  <span className="font-mono" style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.28)' }}>
                    ~${jpyToUsd(r.price_jpy, exchangeRate)}
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {r.is_halal && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', fontSize: '8.5px', color: '#22c55e' }}>
                      <IcHalal size={9} color="#22c55e" /> Halal
                    </span>
                  )}
                  {r.is_student_friendly && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(91,138,94,0.12)', border: '1px solid rgba(91,138,94,0.22)', fontSize: '8.5px', color: '#86efac' }}>
                      <IcCheck size={9} color="#86efac" strokeWidth={3} /> Student
                    </span>
                  )}
                  {r.accepts_suica && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full font-display font-bold"
                      style={{ background: 'rgba(79,70,229,0.12)', border: '1px solid rgba(79,70,229,0.22)', fontSize: '8.5px', color: '#818CF8' }}>
                      Suica
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded halal info */}
              <AnimatePresence>
                {detail?.id === r.id && r.is_halal && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-2 pt-2"
                    style={{ borderTop: '1px solid rgba(34,197,94,0.14)' }}>
                    {r.halal_cert && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <IcHalal size={12} color="#22c55e" />
                        <span style={{ fontSize: '10px', color: '#22c55e' }}>{r.halal_cert}</span>
                      </div>
                    )}
                    {r.distance && (
                      <div className="flex items-center gap-1.5">
                        <IcPin size={12} color="rgba(255,255,255,0.3)" />
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{r.distance}m away</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
