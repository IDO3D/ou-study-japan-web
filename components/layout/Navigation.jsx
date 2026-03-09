// components/layout/Navigation.jsx
import { motion } from 'framer-motion'
import { IcHome, IcCamera, IcMap, IcStar, IcBook, IcHotel, IcUser } from '../ui/Icons'

const NAV_ITEMS = [
  { view: 'home',    Icon: IcHome,   label: 'Home'    },
  { view: 'camera',  Icon: IcCamera, label: 'Scan'    },
  { view: 'map',     Icon: IcMap,    label: 'Map'     },
  { view: 'quests',  Icon: IcStar,   label: 'Quests'  },
  { view: 'canvas',  Icon: IcBook,   label: 'Canvas'  },
  { view: 'housing', Icon: IcHotel,  label: 'Stay'    },
  { view: 'profile', Icon: IcUser,   label: 'Profile' },
]

export default function Navigation({ currentView, onNavigate }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-50 px-3"
      style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}
    >
      <nav
        className="flex items-center justify-between px-1 py-1.5 rounded-[22px]"
        style={{
          background: 'rgba(10,10,12,0.97)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.08)',
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
                  style={{ background: 'rgba(224,36,36,0.14)' }}
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
                  color={active ? '#E02424' : 'rgba(255,255,255,0.32)'}
                  strokeWidth={active ? 2.2 : 1.6}
                />
              </motion.div>
              <span
                className="relative z-10 font-display font-semibold leading-none"
                style={{
                  fontSize: '8.5px',
                  letterSpacing: '0.03em',
                  color: active ? '#FF6B6B' : 'rgba(255,255,255,0.22)',
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
