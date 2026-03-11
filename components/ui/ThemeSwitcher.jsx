// components/ui/ThemeSwitcher.jsx — Native design mode switcher
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../utils/store'
import { getTheme, THEMES } from '../../utils/themes'

const THEME_PREVIEWS = {
  dark:     { bg: '#09090b', accent: '#E02424', label: 'Midnight', sub: 'Dark mode' },
  japan:    { bg: '#1a0a10', accent: '#FF4D7D', label: 'Sakura', sub: 'Japan theme' },
  ou:       { bg: '#0d0305', accent: '#841617', label: 'Crimson', sub: 'OU theme' },
  business: { bg: '#0f1117', accent: '#6366f1', label: 'Carbon', sub: 'Business' },
}

export default function ThemeSwitcher({ onClose }) {
  const { theme, setTheme } = useStore()
  const t = getTheme(theme)

  return (
    <motion.div
      className="absolute inset-0 z-[60] flex flex-col"
      style={{ background: t.bg }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 36 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-safe"
        style={{ paddingTop: 'max(56px, env(safe-area-inset-top))', paddingBottom: 16 }}>
        <div>
          <p className="font-display font-black text-xl" style={{ color: t.text }}>Themes</p>
          <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>Choose your vibe</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: t.surface, border: `1px solid ${t.border}` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scroll px-4 pb-safe"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>

        {/* Theme grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {Object.entries(THEME_PREVIEWS).map(([id, preview]) => {
            const isActive = theme === id
            const themeData = getTheme(id)
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.94 }}
                onClick={() => setTheme(id)}
                className="relative rounded-3xl overflow-hidden text-left"
                style={{
                  border: isActive ? `2px solid ${themeData.brand}` : `1px solid ${themeData.border}`,
                  boxShadow: isActive ? `0 0 24px ${themeData.brand}44` : 'none',
                  background: themeData.bg,
                  height: 160,
                }}
              >
                {/* Theme preview */}
                <div className="absolute inset-0 p-3 flex flex-col">
                  {/* Mini nav */}
                  <div className="flex gap-1 mb-2">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="flex-1 h-1.5 rounded-full"
                        style={{ background: i === 0 ? themeData.brand : `rgba(255,255,255,0.08)` }}/>
                    ))}
                  </div>
                  {/* Mini content lines */}
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2 rounded-full w-2/3" style={{ background: `rgba(255,255,255,0.2)` }}/>
                    <div className="h-1.5 rounded-full w-full" style={{ background: `rgba(255,255,255,0.08)` }}/>
                    <div className="h-1.5 rounded-full w-5/6" style={{ background: `rgba(255,255,255,0.08)` }}/>
                    {/* Color accent bar */}
                    <div className="h-6 rounded-xl mt-2" style={{ background: `${themeData.brand}33`, border: `1px solid ${themeData.brand}44` }}/>
                  </div>
                </div>

                {/* Active checkmark */}
                {isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: themeData.brand }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </motion.div>
                )}

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-3"
                  style={{ background: `linear-gradient(to top, ${themeData.bg} 0%, transparent 100%)` }}>
                  <p className="font-display font-black text-sm" style={{ color: themeData.text }}>{preview.label}</p>
                  <p className="text-[10px]" style={{ color: themeData.textMuted }}>{preview.sub}</p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Current theme info */}
        <div className="p-4 rounded-3xl mb-4"
          style={{ background: t.surface, border: `1px solid ${t.border}` }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: t.brandBg }}>
              <span className="text-base">{THEMES[theme]?.emoji || '🌑'}</span>
            </div>
            <div>
              <p className="font-display font-bold text-sm" style={{ color: t.text }}>
                {THEME_PREVIEWS[theme]?.label} Theme Active
              </p>
              <p className="text-xs" style={{ color: t.textMuted }}>{THEME_PREVIEWS[theme]?.sub}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['brand','accent','success','info'].map(key => (
              <div key={key} className="flex-1 h-6 rounded-lg" style={{ background: t[key] || t.brand }}/>
            ))}
          </div>
        </div>

        {/* Theme descriptions */}
        {[
          { id:'dark', icon:'🌑', title:'Midnight Dark', desc:'Cinema-grade dark theme. Deep blacks, red accents. The default OUStudyJapan experience.' },
          { id:'japan', icon:'🌸', title:'Sakura Japan', desc:'Cherry blossom pink palette. Inspired by Japanese aesthetics and spring in Kyoto.' },
          { id:'ou', icon:'🔴', title:'OU Crimson', desc:'University of Oklahoma official crimson and cream. Boomer Sooner!' },
          { id:'business', icon:'🖤', title:'Carbon Business', desc:'Indigo-tinted professional theme. Clean, minimal, and enterprise-ready.' },
        ].map(th => (
          <button key={th.id} onClick={() => setTheme(th.id)}
            className="w-full flex items-start gap-3 p-3.5 rounded-2xl mb-2 text-left transition-all"
            style={{
              background: theme === th.id ? t.brandBg : t.surface,
              border: `1px solid ${theme === th.id ? t.brand + '44' : t.border}`,
            }}>
            <span className="text-xl">{th.icon}</span>
            <div className="flex-1">
              <p className="font-display font-bold text-sm" style={{ color: t.text }}>{th.title}</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: t.textMuted }}>{th.desc}</p>
            </div>
            {theme === th.id && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: t.brand }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
