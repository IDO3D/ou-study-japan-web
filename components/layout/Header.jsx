// components/layout/Header.jsx
import { motion } from 'framer-motion'
import useStore from '../../utils/store'
import { IcStar } from '../ui/Icons'
import OULogo, { ToriiIcon } from '../ui/OULogo'

const VIEW_META = {
  home: { title: 'Home', sub: null },
  discover: { title: 'Discover', sub: 'Restaurants & Dining' },
  camera: { title: 'Translate', sub: 'AI Japanese Translator' },
  map: { title: 'Map', sub: 'Ibaraki · Kyoto · Tokyo' },
  quests: { title: 'Quests', sub: 'OU Study Japan' },
  canvas: { title: 'Canvas', sub: 'University of Oklahoma' },
  housing: { title: 'Stay', sub: '24 Nights · 3 Cities' },
  profile: { title: 'Profile', sub: 'Account & Preferences' },
}

export default function Header({ currentView, onNavigate }) {
  const { user } = useStore()
  const meta = VIEW_META[currentView] || VIEW_META.home
  const isHome = currentView === 'home'

  return (
    <header
      className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-5"
      style={{
        paddingTop: 'max(48px, env(safe-area-inset-top))',
        paddingBottom: '14px',
        background: 'linear-gradient(to bottom, var(--header-bg) 0%, var(--header-bg) 75%, transparent 100%)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      }}
    >
      {/* Left: Logo (home) or view title */}
      <motion.div
        key={currentView}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-2.5"
      >
        {isHome ? (
          <>
            <OULogo size={30} variant="mark" />
            <div>
              <p className="font-display font-black leading-none" style={{ fontSize: '1.1rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
                OU <span style={{ color: 'var(--brand)' }}>Japan</span>
              </p>
              <p className="font-display font-semibold" style={{ fontSize: '9px', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Study Abroad Program
              </p>
            </div>
          </>
        ) : (
          <>
            <ToriiIcon size={18} color="var(--brand)" />
            <div>
              <h1
                className="font-display font-black text-white leading-none"
                style={{ fontSize: '1.25rem', letterSpacing: '-0.025em' }}
              >
                {meta.title}
              </h1>
              {meta.sub && (
                <p className="font-display font-medium mt-0.5" style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  {meta.sub}
                </p>
              )}
            </div>
          </>
        )}
      </motion.div>

      {/* Right: Points + Avatar */}
      <div className="flex items-center gap-2">
        {/* Points badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: 'var(--brand-subtle)', border: '1px solid var(--brand-glow)' }}
        >
          <IcStar size={11} color="var(--brand-light)" strokeWidth={2.5} style={{ fill: 'var(--brand-light)' }} />
          <span className="font-display font-bold" style={{ fontSize: '11px', color: 'var(--brand-light)' }}>
            {(user.points || 0).toLocaleString()}
          </span>
        </div>

        {/* Avatar */}
        <button
          onClick={() => {
            if (typeof onNavigate === 'function') onNavigate('profile')
            else if (typeof window !== 'undefined' && window.__ouNav) window.__ouNav('profile')
          }}
          className="rounded-full active:scale-90 transition-transform"
          style={{
            padding: '2px',
            background: 'linear-gradient(135deg, var(--brand), #FF8E53)',
            boxShadow: '0 0 14px var(--brand-glow)',
          }}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || 'Profile'}
              width={34}
              height={34}
              className="rounded-full block object-cover"
              style={{ border: '2px solid var(--bg)' }}
            />
          ) : (
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-display font-black text-white text-sm"
              style={{ border: '2px solid var(--bg)', background: 'var(--bg)' }}
            >
              {user.name ? user.name[0].toUpperCase() : '🎌'}
            </div>
          )}
        </button>
      </div>
    </header>
  )
}
