// components/layout/Navigation.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { IcHome, IcCamera, IcMap, IcStar, IcBook, IcHotel, IcUser } from '../ui/Icons'
import ThemeSwitcher from '../ui/ThemeSwitcher'

const NAV_ITEMS = [
  { view: 'home', Icon: IcHome, label: 'Home' },
  { view: 'camera', Icon: IcCamera, label: 'Scan' },
  { view: 'map', Icon: IcMap, label: 'Map' },
  { view: 'quests', Icon: IcStar, label: 'Quests' },
  { view: 'canvas', Icon: IcBook, label: 'Canvas' },
  { view: 'housing', Icon: IcHotel, label: 'Stay' },
  { view: 'profile', Icon: IcUser, label: 'Profile' },
]

// Theme icon
function IcTheme({ size = 19, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

export default function Navigation({ currentView, onNavigate }) {
  const [showTheme, setShowTheme] = useState(false)

  return (
    <>
      <AnimatePresence>
        {showTheme && <ThemeSwitcher onClose={() => setShowTheme(false)} />}
      </AnimatePresence>

      <div
        className="absolute bottom-0 left-0 right-0 z-50 px-3"
        style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}
      >
        <nav
          className="flex items-center justify-between px-1 py-1.5 rounded-[22px]"
          style={{
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid var(--border)',
            boxShadow: '0 -1px 0 rgba(255,255,255,0.04), 0 16px 48px rgba(0,0,0,0.6)',
          }}
        >
          {NAV_ITEMS.map(({ view, Icon, label }) => {
            const active = currentView === view
            return (
              <button
                key={view}
                onClick={() => onNavigate(view)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 relative"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-x-1 inset-y-0 rounded-xl"
                    style={{ background: 'var(--brand-subtle)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <motion.div
                  animate={{ scale: active ? 1.15 : 1, y: active ? -1 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="relative z-10"
                >
                  <Icon
                    size={19}
                    color={active ? 'var(--brand)' : 'rgba(255,255,255,0.32)'}
                    strokeWidth={active ? 2.2 : 1.6}
                  />
                </motion.div>
                <span
                  className="relative z-10 font-display font-semibold leading-none"
                  style={{
                    fontSize: '8.5px',
                    letterSpacing: '0.03em',
                    color: active ? 'var(--brand-light)' : 'rgba(255,255,255,0.22)',
                  }}
                >
                  {label}
                </span>
              </button>
            )
          })}

          {/* Theme toggle button */}
          <button
            onClick={() => setShowTheme(s => !s)}
            className="flex flex-col items-center gap-0.5 py-2 px-2"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <IcTheme size={19} color={showTheme ? 'var(--brand)' : 'rgba(255,255,255,0.32)'} />
            <span className="font-display font-semibold leading-none"
              style={{ fontSize: '8.5px', color: showTheme ? 'var(--brand-light)' : 'rgba(255,255,255,0.22)' }}>
              Theme
            </span>
          </button>
        </nav>
      </div>
    </>
  )
}
