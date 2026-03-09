// components/layout/Navigation.jsx
import { motion } from 'framer-motion'

// 6 nav items — home, discover, camera, map, quests, more (canvas/housing via profile)
// We'll use: Home, Scan, Map, Quests, Canvas, Housing as the 6 tabs
// Displayed as two rows of 3 OR compact 6-wide row

const NAV_ITEMS = [
  { view: 'home',     icon: '⌂',  label: 'Home'    },
  { view: 'camera',   icon: '⊡',  label: 'Scan'    },
  { view: 'map',      icon: '◈',  label: 'Map'     },
  { view: 'quests',   icon: '✦',  label: 'Quests'  },
  { view: 'canvas',   icon: '◻',  label: 'Canvas'  },
  { view: 'housing',  icon: '⬡',  label: 'Stay'    },
  { view: 'profile',  icon: '◯',  label: 'Profile' },
]

export default function Navigation({ currentView, onNavigate }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-5 safe-bottom">
      <nav
        className="flex items-center justify-between px-2 py-2 rounded-[1.75rem]"
        style={{
          background: 'rgba(12, 12, 14, 0.98)',
          backdropFilter: 'blur(30px) saturate(200%)',
          WebkitBackdropFilter: 'blur(30px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.view
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 relative active:scale-90 transition-transform"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-bg"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(224,36,36,0.13)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className="relative z-10 text-base transition-all duration-200"
                style={{
                  color: isActive ? '#E02424' : 'rgba(255,255,255,0.3)',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  filter: isActive ? 'drop-shadow(0 0 5px rgba(224,36,36,0.6))' : 'none',
                  fontFamily: 'serif',
                }}
              >
                {item.icon}
              </span>
              <span
                className="relative z-10 text-[8px] font-display font-bold tracking-wide leading-none transition-all duration-200"
                style={{ color: isActive ? '#FF6B6B' : 'rgba(255,255,255,0.22)' }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
