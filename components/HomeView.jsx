// components/HomeView.jsx — Production, no emojis
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../utils/store'
import { formatJpy, formatUsd, jpyToUsd, getGreeting, formatJapanDate } from '../utils/helpers'
import { IcCamera, IcMap, IcFood, IcStar, IcMoney, IcJapan, IcCheck, IcArrow, IcHalal } from './ui/Icons'

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 20, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 26 } },
  },
}

const QUICK_ACTIONS = [
  { Icon: IcCamera, label: 'Scan Menu', view: 'camera', color: 'rgba(224,36,36,0.14)', border: 'rgba(224,36,36,0.28)', iconColor: '#FF8E8E' },
  { Icon: IcMap,    label: 'Map',       view: 'map',    color: 'rgba(79,70,229,0.14)', border: 'rgba(79,70,229,0.28)', iconColor: '#818CF8' },
  { Icon: IcFood,   label: 'Eat',       view: 'discover',color:'rgba(91,138,94,0.14)', border: 'rgba(91,138,94,0.28)', iconColor: '#86efac' },
  { Icon: IcStar,   label: 'Quests',    view: 'quests', color: 'rgba(255,183,197,0.14)', border: 'rgba(255,183,197,0.28)', iconColor: '#FFB7C5' },
]

// Reliable production image map by restaurant category
const FALLBACK_IMAGES = {
  'Ramen':      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
  'Beef Cutlet':'https://images.unsplash.com/photo-1607301406259-dfb186e15582?w=400&q=80',
  'Gyudon':     'https://images.unsplash.com/photo-1569398034126-476e3a4af72f?w=400&q=80',
  'Burger':     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'Italian':    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  'Halal':      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80',
  'default':    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
}

function safeImg(r) {
  if (r?.image_url && r.image_url.startsWith('http')) return r.image_url
  return FALLBACK_IMAGES[r?.category] || FALLBACK_IMAGES.default
}

export default function HomeView({ onNavigate }) {
  const { user, exchangeRate, quests, restaurants, getTodaySpent } = useStore()
  const [time, setTime] = useState('')
  const spent   = getTodaySpent()
  const remaining = user.dailyBudgetJpy - spent
  const spentPct  = Math.min((spent / user.dailyBudgetJpy) * 100, 100)
  const featuredQuest = quests.find(q => !q.completed)

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' }))
    update()
    const t = setInterval(update, 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="px-5 pb-4 space-y-5">

      {/* ── Greeting ─────────────────────────── */}
      <motion.div variants={stagger.item} className="pt-1">
        <div className="flex items-center gap-2 mb-1">
          <IcJapan size={13} color="rgba(255,255,255,0.28)" />
          <span className="font-display font-semibold uppercase tracking-widest" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.32)' }}>
            {formatJapanDate()}
          </span>
          {time && <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)' }}>{time} JST</span>}
        </div>
        <h2 className="font-display font-extrabold leading-[1.1]" style={{ fontSize: '2.4rem', letterSpacing: '-0.03em' }}>
          {getGreeting()},<br />
          <span className="text-gradient">{user.name}.</span>
        </h2>
      </motion.div>

      {/* ── Budget Card ──────────────────────── */}
      <motion.div variants={stagger.item}>
        <div className="p-6 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(224,36,36,0.16) 0%, rgba(18,18,20,0.97) 65%)',
            border: '1px solid rgba(224,36,36,0.22)',
            boxShadow: '0 8px 32px rgba(224,36,36,0.1)',
          }}>
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full blur-3xl" style={{ background: 'rgba(224,36,36,0.18)' }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#FF8E8E' }}>
                Daily Budget
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: remaining >= 0 ? 'rgba(91,138,94,0.15)' : 'rgba(224,36,36,0.15)', border: remaining >= 0 ? '1px solid rgba(91,138,94,0.25)' : '1px solid rgba(224,36,36,0.3)' }}>
                <IcCheck size={10} color={remaining >= 0 ? '#86efac' : '#F87171'} strokeWidth={3} />
                <span className="font-display font-bold" style={{ fontSize: '10px', color: remaining >= 0 ? '#86efac' : '#F87171' }}>
                  {remaining >= 0 ? 'On track' : 'Over budget'}
                </span>
              </div>
            </div>
            <div className="mb-1">
              <span className="font-display font-black text-white" style={{ fontSize: '3rem', letterSpacing: '-0.04em' }}>
                {formatJpy(remaining)}
              </span>
            </div>
            <p className="mb-4" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)' }}>
              {formatUsd(jpyToUsd(remaining, exchangeRate))} remaining &middot; {formatJpy(spent)} spent
            </p>
            <div className="progress-bar">
              <motion.div className="progress-fill" initial={{ width: 0 }}
                animate={{ width: `${spentPct}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Actions ────────────────────── */}
      <motion.div variants={stagger.item}>
        <div className="grid grid-cols-4 gap-2.5">
          {QUICK_ACTIONS.map(({ Icon, label, view, color, border, iconColor }) => (
            <button key={view} onClick={() => onNavigate(view)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl active:scale-95 transition-transform"
              style={{ background: color, border: `1px solid ${border}` }}>
              <Icon size={22} color={iconColor} strokeWidth={1.8} />
              <span className="font-display font-bold" style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em' }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Nearby Restaurants ───────────────── */}
      {restaurants.length > 0 && (
        <motion.div variants={stagger.item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-white" style={{ fontSize: '15px' }}>Nearby Eats</h3>
            <button onClick={() => onNavigate('discover')}
              className="font-display font-bold flex items-center gap-1" style={{ fontSize: '11px', color: '#E02424' }}>
              See all <IcArrow dir="right" size={11} color="#E02424" strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scroll pb-1">
            {restaurants.slice(0, 5).map(r => (
              <button key={r.id} onClick={() => onNavigate('discover')}
                className="flex-shrink-0 w-40 rounded-2xl overflow-hidden active:scale-95 transition-transform text-left"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="relative h-24">
                  <img src={safeImg(r)} alt={r.name} className="w-full h-full object-cover"
                    onError={e => { e.target.src = FALLBACK_IMAGES.default }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent 55%)' }} />
                  <div className="absolute bottom-2 left-2">
                    <span className="font-display font-black text-white" style={{ fontSize: '11px' }}>{formatJpy(r.price_jpy)}</span>
                  </div>
                  {r.is_halal && (
                    <div className="absolute top-2 right-2">
                      <IcHalal size={14} />
                    </div>
                  )}
                </div>
                <div className="p-2.5" style={{ background: 'rgba(18,18,20,0.97)' }}>
                  <h4 className="font-display font-bold text-white truncate" style={{ fontSize: '11px' }}>{r.name}</h4>
                  <p className="mt-0.5 truncate" style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.38)' }}>{r.category}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Featured Quest ───────────────────── */}
      {featuredQuest && (
        <motion.div variants={stagger.item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-white" style={{ fontSize: '15px' }}>Featured Quest</h3>
            <button onClick={() => onNavigate('quests')}
              className="font-display font-bold flex items-center gap-1" style={{ fontSize: '11px', color: '#E02424' }}>
              View all <IcArrow dir="right" size={11} color="#E02424" strokeWidth={2.5} />
            </button>
          </div>
          <button className="relative w-full h-48 rounded-3xl overflow-hidden active:scale-[0.98] transition-transform"
            onClick={() => onNavigate('quests')}>
            <img src={featuredQuest.image_url} alt={featuredQuest.title} className="w-full h-full object-cover"
              onError={e => { e.target.src = FALLBACK_IMAGES.default }} />
            <div className="absolute inset-0 flex flex-col justify-end p-5"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-brand" style={{ fontSize: '9px' }}>
                  <IcStar size={9} color="#FF6B6B" style={{ fill: '#FF6B6B' }} /> {featuredQuest.points} pts
                </span>
                <span className="badge badge-sakura" style={{ fontSize: '9px' }}>{featuredQuest.category}</span>
              </div>
              <h4 className="font-display font-bold text-white leading-tight" style={{ fontSize: '18px' }}>{featuredQuest.title}</h4>
              {featuredQuest.title_jp && (
                <p className="font-jp mt-1" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>{featuredQuest.title_jp}</p>
              )}
            </div>
          </button>
        </motion.div>
      )}

      {/* ── Currency Widget ──────────────────── */}
      <motion.div variants={stagger.item}>
        <div className="p-4 rounded-2xl flex items-center justify-between"
          style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <IcMoney size={18} color="#86efac" />
            <div>
              <p className="font-display font-bold uppercase tracking-widest" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.32)' }}>Live Rate</p>
              <p className="font-mono font-bold text-white" style={{ fontSize: '14px' }}>¥1,000 = ${(1000 * exchangeRate).toFixed(2)}</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl font-display font-bold"
            style={{ fontSize: '10px', background: 'rgba(91,138,94,0.14)', color: '#86efac', border: '1px solid rgba(91,138,94,0.22)' }}>
            JPY / USD
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
