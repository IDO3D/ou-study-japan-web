// components/layout/Header.jsx
import { motion } from 'framer-motion'
import useStore from '../../utils/store'
import { IcStar } from '../ui/Icons'

const VIEW_META = {
  home:     { title: 'Home',          sub: null },
  discover: { title: 'Discover',      sub: 'Restaurants & Halal' },
  camera:   { title: 'Translate',     sub: 'Point at any text' },
  map:      { title: 'Map',           sub: 'Ibaraki · Kyoto · Tokyo' },
  quests:   { title: 'Quests',        sub: 'OU Study Japan' },
  canvas:   { title: 'Canvas',        sub: 'OU · Japan Program' },
  housing:  { title: 'Housing',       sub: '24 Nights · 3 Cities' },
  profile:  { title: 'Profile',       sub: 'Account & Tools' },
}

export default function Header({ currentView, onNavigate }) {
  const { user } = useStore()
  const meta = VIEW_META[currentView] || VIEW_META.home

  return (
    <header
      className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-5"
      style={{
        paddingTop: 'max(48px, env(safe-area-inset-top))',
        paddingBottom: '14px',
        background: 'linear-gradient(to bottom, rgba(9,9,11,0.98) 0%, rgba(9,9,11,0.85) 75%, transparent 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <motion.div
        key={currentView}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1
          className="font-display font-black text-white leading-none"
          style={{ fontSize: '1.35rem', letterSpacing: '-0.025em' }}
        >
          {meta.title}
        </h1>
        {meta.sub && (
          <p className="font-display font-medium mt-0.5" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.04em' }}>
            {meta.sub}
          </p>
        )}
      </motion.div>

      <div className="flex items-center gap-2.5">
        {/* Points badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(224,36,36,0.14)', border: '1px solid rgba(224,36,36,0.22)' }}
        >
          <IcStar size={11} color="#FF6B6B" strokeWidth={2.5} style={{ fill: '#FF6B6B' }} />
          <span className="font-display font-bold" style={{ fontSize: '11px', color: '#FF8E8E' }}>
            {user.points.toLocaleString()}
          </span>
        </div>

        {/* Avatar */}
        <button
          onClick={() => { if (typeof onNavigate === 'function') onNavigate('profile'); else if (typeof window !== 'undefined' && window.__ouNav) window.__ouNav('profile') }}
          className="rounded-full active:scale-90 transition-transform"
          style={{
            padding: '2px',
            background: 'linear-gradient(135deg, #E02424, #FF8E53)',
            boxShadow: '0 0 12px rgba(224,36,36,0.35)',
          }}
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            width={34}
            height={34}
            className="rounded-full block object-cover"
            style={{ border: '2px solid #09090b' }}
          />
        </button>
      </div>
    </header>
  )
}
