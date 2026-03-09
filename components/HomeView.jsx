// components/HomeView.jsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../utils/store'
import { formatJpy, formatUsd, jpyToUsd } from '../utils/helpers'
import { getGreeting, getGreetingEn, formatJapanDate } from '../utils/helpers'

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: {
    initial: { opacity: 0, y: 22, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 26 } },
  },
}

export default function HomeView({ onNavigate }) {
  const { user, exchangeRate, quests, restaurants, getTodaySpent } = useStore()
  const [time, setTime] = useState('')
  const spent = getTodaySpent()
  const remaining = user.dailyBudgetJpy - spent
  const spentPct = Math.min((spent / user.dailyBudgetJpy) * 100, 100)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const t = setInterval(update, 30000)
    return () => clearInterval(t)
  }, [])

  const featuredQuest = quests.find(q => !q.completed)

  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="px-5 pb-6 space-y-5"
    >
      {/* ── Greeting ────────────────────────── */}
      <motion.div variants={stagger.item} className="pt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-display font-semibold tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            {formatJapanDate()}
          </span>
          {time && (
            <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              🇯🇵 {time}
            </span>
          )}
        </div>
        <h2 className="text-4xl font-display font-extrabold leading-[1.1]" style={{ letterSpacing: '-0.03em' }}>
          {getGreeting()},<br />
          <span className="text-gradient">{user.name}.</span>
        </h2>
      </motion.div>

      {/* ── Budget Card ──────────────────────── */}
      <motion.div variants={stagger.item}>
        <div
          className="p-6 rounded-3xl relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(224,36,36,0.18) 0%, rgba(18,18,20,0.95) 60%)',
            border: '1px solid rgba(224,36,36,0.25)',
            boxShadow: '0 8px 32px rgba(224,36,36,0.12)',
          }}
        >
          {/* Glow blob */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl"
            style={{ background: 'rgba(224,36,36,0.2)' }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-display font-bold uppercase tracking-widest" style={{ color: '#FF8E8E' }}>
                Daily Budget
              </span>
              <span
                className="text-xs font-display font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
              >
                {remaining >= 0 ? '✓ On track' : '⚠ Over budget'}
              </span>
            </div>

            <div className="mb-1">
              <span className="text-5xl font-display font-black" style={{ letterSpacing: '-0.04em', color: 'white' }}>
                {formatJpy(remaining)}
              </span>
            </div>
            <p className="text-sm font-body mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              ≈ {formatUsd(jpyToUsd(remaining, exchangeRate))} remaining · {formatJpy(spent)} spent
            </p>

            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${spentPct}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Actions ────────────────────── */}
      <motion.div variants={stagger.item}>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '📸', label: 'Scan Menu', action: 'camera', color: 'rgba(224,36,36,0.15)', border: 'rgba(224,36,36,0.3)' },
            { icon: '🗺️', label: 'Map', action: 'map', color: 'rgba(79,70,229,0.15)', border: 'rgba(79,70,229,0.3)' },
            { icon: '🍜', label: 'Eat', action: 'discover', color: 'rgba(91,138,94,0.15)', border: 'rgba(91,138,94,0.3)' },
            { icon: '✦', label: 'Quests', action: 'quests', color: 'rgba(255,183,197,0.15)', border: 'rgba(255,183,197,0.3)' },
          ].map((item) => (
            <button
              key={item.action}
              onClick={() => onNavigate(item.action)}
              className="flex flex-col items-center gap-2 p-3.5 rounded-2xl active:scale-95 transition-transform"
              style={{ background: item.color, border: `1px solid ${item.border}` }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-display font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Nearby Restaurants ───────────────── */}
      {restaurants.length > 0 && (
        <motion.div variants={stagger.item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-white">Nearby Eats</h3>
            <button
              onClick={() => onNavigate('discover')}
              className="text-xs font-display font-bold"
              style={{ color: '#E02424' }}
            >
              See All →
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scroll pb-1">
            {restaurants.slice(0, 4).map((r) => (
              <div
                key={r.id}
                className="flex-shrink-0 w-44 rounded-2xl overflow-hidden active:scale-95 transition-transform cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="relative h-28">
                  <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-2"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
                    <span className="text-[10px] font-display font-bold text-white">{formatJpy(r.price_jpy)}</span>
                  </div>
                </div>
                <div className="p-3" style={{ background: 'rgba(18,18,20,0.95)' }}>
                  <h4 className="text-xs font-display font-bold text-white truncate">{r.name}</h4>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.category}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Featured Quest ───────────────────── */}
      {featuredQuest && (
        <motion.div variants={stagger.item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-white">Featured Quest</h3>
            <button onClick={() => onNavigate('quests')} className="text-xs font-display font-bold" style={{ color: '#E02424' }}>
              View All →
            </button>
          </div>
          <div
            className="relative h-52 rounded-3xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
            onClick={() => onNavigate('quests')}
          >
            <img src={featuredQuest.image_url} alt={featuredQuest.title} className="w-full h-full object-cover" />
            <div
              className="absolute inset-0 flex flex-col justify-end p-5"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-brand">★ {featuredQuest.points} pts</span>
                <span className="badge badge-sakura">{featuredQuest.category}</span>
              </div>
              <h4 className="text-xl font-display font-bold text-white leading-tight">{featuredQuest.title}</h4>
              <p className="text-xs font-jp mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{featuredQuest.title_jp}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Currency Widget ──────────────────── */}
      <motion.div variants={stagger.item}>
        <div
          className="p-4 rounded-2xl flex items-center justify-between"
          style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <p className="text-xs font-display font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Live Rate
            </p>
            <p className="font-mono font-bold text-white">¥1,000 = ${(1000 * exchangeRate).toFixed(2)}</p>
          </div>
          <div
            className="px-3 py-1.5 rounded-xl text-xs font-display font-bold"
            style={{ background: 'rgba(91,138,94,0.15)', color: '#86efac', border: '1px solid rgba(91,138,94,0.25)' }}
          >
            JPY/USD
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
