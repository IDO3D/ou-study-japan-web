// components/layout/Header.jsx
import { motion } from 'framer-motion'
import useStore from '../../utils/store'

const VIEW_TITLES = {
  home:     'Home',
  discover: 'Discover',
  camera:   'Translate',
  map:      'Map',
  quests:   'Quests',
  canvas:   'Canvas',
  housing:  'Housing',
  profile:  'Profile',
}

const VIEW_SUBTITLES = {
  canvas:  'OU · Japan Program',
  housing: '24 Nights · 3 Cities',
  quests:  'OU Study Japan',
  map:     'Ibaraki · Kyoto · Tokyo',
}

export default function Header({ currentView }) {
  const { user } = useStore()

  return (
    <header
      className="absolute top-0 left-0 right-0 z-40 px-5 pt-12 pb-4"
      style={{
        background: 'linear-gradient(to bottom, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.82) 70%, transparent 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center justify-between">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            className="font-display font-black text-white leading-none"
            style={{ fontSize: '1.4rem', letterSpacing: '-0.025em' }}
          >
            {VIEW_TITLES[currentView] || 'OUStudyJapan'}
          </h1>
          {VIEW_SUBTITLES[currentView] && (
            <p className="text-[10px] font-display font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {VIEW_SUBTITLES[currentView]}
            </p>
          )}
        </motion.div>

        <div className="flex items-center gap-2.5">
          {/* Points */}
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(224,36,36,0.15)', border: '1px solid rgba(224,36,36,0.25)' }}
          >
            <span className="text-xs font-display font-black" style={{ color: '#FF6B6B' }}>
              ★ {user.points.toLocaleString()}
            </span>
          </motion.div>

          {/* Avatar → Profile */}
          <div
            onClick={() => typeof window !== 'undefined' && window.__ouNavigate?.('profile')}
            className="w-9 h-9 rounded-full p-[2px] active:scale-90 transition-transform cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #E02424, #FF8E53)',
              boxShadow: '0 0 14px rgba(224,36,36,0.4)',
            }}
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
              style={{ border: '2px solid #09090b' }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
