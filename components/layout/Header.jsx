// components/layout/Header.jsx — v5 Theme-aware with theme switcher
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../utils/store'
import { IcStar } from '../ui/Icons'
import { getTheme } from '../../utils/themes'
import ThemeSwitcher from '../ui/ThemeSwitcher'

const VIEW_META = {
  home:     { title: 'Home',          sub: null },
  discover: { title: 'Discover',      sub: 'Food & Dining' },
  camera:   { title: 'Translate',     sub: 'Camera · Voice · Live AR' },
  map:      { title: 'Map',           sub: 'Ibaraki · Kyoto · Tokyo' },
  quests:   { title: 'Quests',        sub: 'Top 50 · Program · Nearby' },
  canvas:   { title: 'Canvas',        sub: 'OU Japan Program' },
  housing:  { title: 'Stay',          sub: '24 Nights · 3 Cities' },
  profile:  { title: 'Profile',       sub: 'Account & Tools' },
}

function ThemeOrb({ theme, onClick }) {
  const t = getTheme(theme)
  const colors = { dark:'#E02424', japan:'#FF4D7D', ou:'#841617', business:'#6366f1' }
  const color = colors[theme] || '#E02424'
  return (
    <button onClick={onClick}
      className="w-8 h-8 rounded-full flex items-center justify-center relative"
      style={{ background: `${color}22`, border: `1.5px solid ${color}55` }}>
      <div className="w-3 h-3 rounded-full" style={{ background: color }}/>
    </button>
  )
}

export default function Header({ currentView, onNavigate }) {
  const { user, theme } = useStore()
  const t = getTheme(theme)
  const meta = VIEW_META[currentView] || VIEW_META.home
  const [showTheme, setShowTheme] = useState(false)

  return (
    <>
      <header
        className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-5"
        style={{
          paddingTop: 'max(48px, env(safe-area-inset-top))',
          paddingBottom: '14px',
          background: `linear-gradient(to bottom, ${t.bg}F8 0%, ${t.bg}D0 75%, transparent 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <motion.div key={currentView} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="font-display font-black text-white leading-none"
            style={{ fontSize: '1.35rem', letterSpacing: '-0.025em' }}>
            {meta.title}
          </h1>
          {meta.sub && (
            <p className="font-display font-medium mt-0.5"
              style={{ fontSize: '10px', color: t.textMuted, letterSpacing: '0.04em' }}>
              {meta.sub}
            </p>
          )}
        </motion.div>

        <div className="flex items-center gap-2">
          {/* Theme orb */}
          <ThemeOrb theme={theme} onClick={() => setShowTheme(true)}/>

          {/* Points badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: t.brandBg, border: `1px solid ${t.brand}33` }}>
            <IcStar size={11} color={t.brandLight} strokeWidth={2.5} style={{ fill: t.brandLight }}/>
            <span className="font-display font-bold" style={{ fontSize: '11px', color: t.brandLight }}>
              {user.points.toLocaleString()}
            </span>
          </div>

          {/* Avatar */}
          <button
            onClick={() => { if (typeof onNavigate === 'function') onNavigate('profile') }}
            className="rounded-full active:scale-90 transition-transform"
            style={{ padding: '2px', background: `linear-gradient(135deg, ${t.brand}, ${t.accent})`, boxShadow: `0 0 12px ${t.brandGlow}` }}>
            <img src={user.avatarUrl} alt={user.name} width={34} height={34}
              className="rounded-full block object-cover" style={{ border: `2px solid ${t.bg}` }}
              onError={e => { e.target.src = 'https://i.pravatar.cc/150?img=33' }}/>
          </button>
        </div>
      </header>

      {/* Theme switcher overlay */}
      <AnimatePresence>
        {showTheme && <ThemeSwitcher onClose={() => setShowTheme(false)}/>}
      </AnimatePresence>
    </>
  )
}
