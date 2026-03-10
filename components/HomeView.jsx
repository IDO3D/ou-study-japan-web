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
  { Icon: IcMap, label: 'Map', view: 'map', color: 'rgba(79,70,229,0.14)', border: 'rgba(79,70,229,0.28)', iconColor: '#818CF8' },
  { Icon: IcFood, label: 'Eat', view: 'discover', color: 'rgba(91,138,94,0.14)', border: 'rgba(91,138,94,0.28)', iconColor: '#86efac' },
  { Icon: IcStar, label: 'Quests', view: 'quests', color: 'rgba(255,183,197,0.14)', border: 'rgba(255,183,197,0.28)', iconColor: '#FFB7C5' },
]

// Reliable production image map by restaurant category
const FALLBACK_IMAGES = {
  'Ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
  'Beef Cutlet': 'https://images.unsplash.com/photo-1607301406259-dfb186e15582?w=400&q=80',
  'Gyudon': 'https://images.unsplash.com/photo-1569398034126-476e3a4af72f?w=400&q=80',
  'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'Italian': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  'Halal': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80',
  'default': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
}

function safeImg(r) {
  if (r?.image_url && r.image_url.startsWith('http')) return r.image_url
  return FALLBACK_IMAGES[r?.category] || FALLBACK_IMAGES.default
}

export default function HomeView({ onNavigate }) {
  const { user, exchangeRate, quests, restaurants, getTodaySpent } = useStore()
  const [time, setTime] = useState('')
  const spent = getTodaySpent()
  const remaining = user.dailyBudgetJpy - spent
  const spentPct = Math.min((spent / user.dailyBudgetJpy) * 100, 100)
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

      {/* ── Realistic Suica Digital Wallet ──────────────────────── */}
      <motion.div variants={stagger.item}>
        <div className="relative rounded-[24px] p-6 overflow-hidden shadow-2xl group cursor-pointer border border-white/10"
          style={{
            background: 'linear-gradient(135deg, #121214 0%, #080809 100%)',
          }}>
          {/* Suica iconic green gradient backdrop */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at top right, #34C759, transparent 60%)' }} />
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(52,199,89,0.15)' }} />

          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-xl drop-shadow-md">🍏</span>
                <span className="font-display font-black text-white tracking-widest uppercase text-[12px] opacity-90 drop-shadow-md">Pay</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/40 border border-white/10 shadow-lg">
                <div className={`w-2 h-2 rounded-full ${remaining >= 0 ? 'bg-[#34C759] shadow-[0_0_8px_#34C759]' : 'bg-[#FF3B30] shadow-[0_0_8px_#FF3B30]'}`}></div>
                <span className="font-display font-bold uppercase tracking-widest text-[9px] text-white/80">
                  {remaining >= 0 ? 'Budget OK' : 'Over Limit'}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-1 drop-shadow-lg">
                <span className="font-display font-black text-white tracking-tighter" style={{ fontSize: '3.5rem', lineHeight: '1' }}>
                  {formatJpy(remaining)}
                </span>
                <span className="font-display font-bold text-white/50 text-sm tracking-widest uppercase">JPY</span>
              </div>
              <p className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase drop-shadow-md">
                {formatUsd(jpyToUsd(remaining, exchangeRate))} Est. USD Left
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
              <div className="flex flex-col">
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-0.5">Today's Spend</span>
                <span className="font-mono text-xs text-white/90">{formatJpy(spent)} / {formatJpy(user.dailyBudgetJpy)}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 10h16M4 14h16M4 18h16M20 6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Snippet */}
        <div className="mt-4 bg-[#0A0A0B] rounded-[20px] border border-white/5 p-4 mx-1 shadow-md">
          <h4 className="font-display font-bold text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Recent Transactions</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF9500]/10 border border-[#FF9500]/20 flex items-center justify-center text-[16px]">🍜</div>
                <div>
                  <p className="font-bold text-[12px] text-white tracking-wide">Ichiran Ramen</p>
                  <p className="text-[9px] text-white/40 font-mono tracking-wider mt-0.5">Today, 12:45 PM</p>
                </div>
              </div>
              <span className="font-mono text-[12px] font-bold text-white">-¥1,250</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5AC8FA]/10 border border-[#5AC8FA]/20 flex items-center justify-center text-[16px]">🚇</div>
                <div>
                  <p className="font-bold text-[12px] text-white tracking-wide">Tokyo Metro (Suica)</p>
                  <p className="text-[9px] text-white/40 font-mono tracking-wider mt-0.5">Today, 09:30 AM</p>
                </div>
              </div>
              <span className="font-mono text-[12px] font-bold text-white">-¥210</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Actions Grid ────────────────────── */}
      <motion.div variants={stagger.item}>
        <div className="grid grid-cols-4 gap-3 px-2 pt-2">
          {QUICK_ACTIONS.map(({ Icon, label, view, color, border, iconColor }) => (
            <button key={view} onClick={() => onNavigate(view)}
              className="flex flex-col items-center gap-2.5 group"
            >
              <div className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center shadow-xl active:scale-90 transition-all border border-white/10 group-hover:border-white/20"
                style={{ background: 'linear-gradient(180deg, rgba(30,30,34,0.9) 0%, rgba(18,18,20,0.95) 100%)' }}>
                <Icon size={26} color={iconColor} strokeWidth={1.8} />
              </div>
              <span className="font-display font-semibold text-[10px] tracking-wide text-white/60 group-hover:text-white transition-colors">
                {label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Nearby Restaurants ───────────────── */}
      {restaurants.length > 0 && (
        <motion.div variants={stagger.item} className="mt-2">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-display font-black text-white tracking-tight" style={{ fontSize: '18px' }}>Nearby Eats</h3>
            <button onClick={() => onNavigate('discover')}
              className="font-display font-bold flex items-center gap-1.5 px-3 py-1 bg-[#E02424]/10 rounded-full text-[#E02424] border border-[#E02424]/20 active:scale-95 transition-transform" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              See all <IcArrow dir="right" size={10} color="#E02424" strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scroll pb-4 px-1 snap-x">
            {restaurants.slice(0, 5).map(r => (
              <button key={r.id} onClick={() => onNavigate('discover')}
                className="flex-shrink-0 w-44 rounded-[20px] overflow-hidden active:scale-95 transition-transform text-left snap-start shadow-xl"
                style={{ background: 'linear-gradient(180deg, rgba(25,25,30,0.9) 0%, rgba(15,15,18,0.95) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="relative h-28">
                  <img src={safeImg(r)} alt={r.name} className="w-full h-full object-cover"
                    onError={e => { e.target.src = FALLBACK_IMAGES.default }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)' }} />
                  <div className="absolute bottom-2.5 left-3">
                    <span className="font-mono font-bold text-white tracking-widest px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md border border-white/10" style={{ fontSize: '10px' }}>{formatJpy(r.price_jpy)}</span>
                  </div>
                  {r.is_halal && (
                    <div className="absolute top-2.5 right-2.5 bg-green-500/20 backdrop-blur-md p-1.5 rounded-full border border-green-500/30 shadow-lg">
                      <IcHalal size={12} color="#86efac" />
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <h4 className="font-display font-bold text-white truncate text-[13px] tracking-tight">{r.name}</h4>
                  <p className="mt-1 truncate font-medium text-[10px] text-white/40 uppercase tracking-widest">{r.category}</p>
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
            <h3 className="font-display font-bold text-[color:var(--text)]" style={{ fontSize: '15px' }}>Featured Quest</h3>
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
              <h4 className="font-display font-bold text-[color:var(--text)] leading-tight" style={{ fontSize: '18px' }}>{featuredQuest.title}</h4>
              {featuredQuest.title_jp && (
                <p className="font-jp mt-1" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>{featuredQuest.title_jp}</p>
              )}
            </div>
          </button>
        </motion.div>
      )}

      {/* ── Live Utilities ──────────────────── */}
      <motion.div variants={stagger.item} className="grid grid-cols-2 gap-3 px-1 pb-4">
        {/* Currency Card */}
        <div className="p-4 rounded-[20px] flex flex-col justify-between shadow-lg"
          style={{ background: 'linear-gradient(135deg, rgba(20,20,24,0.9) 0%, rgba(10,10,12,0.95) 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-[#86efac]/10 flex items-center justify-center border border-[#86efac]/20">
              <IcMoney size={16} color="#86efac" />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest text-[#86efac] bg-[#86efac]/10 px-2 py-1 rounded-full border border-[#86efac]/20 shadow-sm">Live</span>
          </div>
          <div>
            <p className="font-display font-bold uppercase tracking-widest text-[9px] text-white/40 mb-1.5">Exchange Rate</p>
            <p className="font-mono font-bold text-[13px] text-white tracking-tight">¥1,000 = ${(1000 * exchangeRate).toFixed(2)}</p>
          </div>
        </div>

        {/* Weather Card */}
        <div className="p-4 rounded-[20px] flex flex-col justify-between relative overflow-hidden shadow-lg"
          style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#60A5FA]/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-2xl drop-shadow-md">🌤️</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 bg-black/20 px-2 py-1 rounded-full border border-white/5 backdrop-blur-sm">Tokyo</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <p className="font-display font-black text-[28px] text-white leading-none tracking-tighter drop-shadow-lg">18°</p>
              <p className="text-[10px] font-bold text-white/60 uppercase">C</p>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 drop-shadow-sm">Partly Cloudy</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
