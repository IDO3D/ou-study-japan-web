// components/NaviOverlay.jsx
// Apple Maps / Waze-style navigation overlay with transport modes
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'
import { getTheme } from '../utils/themes'

const TRANSPORT_MODES = [
  { id: 'walk',    label: 'Walk',    icon: WalkIcon,    color: '#22c55e', time: 18, dist: '1.2km', cal: '120' },
  { id: 'bike',    label: 'Cycle',   icon: BikeIcon,    color: '#f59e0b', time: 8,  dist: '1.2km', cal: '60' },
  { id: 'transit', label: 'Transit', icon: TrainIcon,   color: '#60a5fa', time: 12, dist: '2.1km', fare: '¥230' },
  { id: 'car',     label: 'Drive',   icon: CarIcon,     color: '#e879f9', time: 5,  dist: '1.8km', info: 'No parking' },
  { id: 'taxi',    label: 'Taxi',    icon: TaxiIcon,    color: '#fb923c', time: 5,  dist: '1.8km', fare: '~¥900' },
]

function WalkIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/>
      <path d="M9 10l-2 6M15 10l2 6M9 13l6-1M10 17l1 5M14 17l-1 5"/>
    </svg>
  )
}
function BikeIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
      <path d="M15 6h2l2 5.5M5.5 17.5L10 10l2.5 4h4L14 8h-3"/>
    </svg>
  )
}
function TrainIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="14" rx="3"/>
      <path d="M4 10h16"/><circle cx="8.5" cy="16.5" r="1.2"/><circle cx="15.5" cy="16.5" r="1.2"/>
      <path d="M8 20l-2 2M16 20l2 2"/>
    </svg>
  )
}
function CarIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h2l3-4h8l3 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
    </svg>
  )
}
function TaxiIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h2l3-4h8l3 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
      <path d="M10 3h4M8 7h8"/>
    </svg>
  )
}

// Animated road/path SVG
function AnimatedRoute({ mode }) {
  const color = TRANSPORT_MODES.find(m => m.id === mode)?.color || '#60a5fa'
  return (
    <svg viewBox="0 0 320 180" className="w-full" style={{ height: 180 }}>
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
          <stop offset="50%" stopColor={color} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.15"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      {/* Road base */}
      <path d="M 20 160 Q 60 140 80 100 Q 120 40 160 60 Q 200 80 240 50 Q 270 30 300 20"
        stroke="rgba(255,255,255,0.06)" strokeWidth="28" fill="none" strokeLinecap="round"/>
      {/* Road center stripe */}
      <path d="M 20 160 Q 60 140 80 100 Q 120 40 160 60 Q 200 80 240 50 Q 270 30 300 20"
        stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="12 8"/>
      {/* Animated route line */}
      <motion.path
        d="M 20 160 Q 60 140 80 100 Q 120 40 160 60 Q 200 80 240 50 Q 270 30 300 20"
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Pulse dot along route */}
      <motion.circle
        cx="0" cy="0" r="6"
        fill={color}
        filter="url(#glow)"
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: '100%' }}
        style={{ offsetPath: "path('M 20 160 Q 60 140 80 100 Q 120 40 160 60 Q 200 80 240 50 Q 270 30 300 20')" }}
        transition={{ duration: 2.5, ease: 'linear', repeat: Infinity }}
      />
      {/* Origin dot */}
      <circle cx="20" cy="160" r="8" fill="white" opacity="0.9"/>
      <circle cx="20" cy="160" r="4" fill="#1a1a1e"/>
      {/* Destination marker */}
      <motion.g initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ delay: 0.8, type: 'spring' }}>
        <circle cx="300" cy="20" r="10" fill={color} opacity="0.9"/>
        <path d="M300 15 L303 20 L300 18 L297 20 Z" fill="white" transform="scale(1.2) translate(-50,-3.5)"/>
        <text x="300" y="24" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">★</text>
      </motion.g>
      {/* ETA bubble */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        <rect x="110" y="55" width="50" height="22" rx="11" fill={color} opacity="0.9"/>
        <text x="135" y="70" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold" fontFamily="system-ui">
          {TRANSPORT_MODES.find(m => m.id === mode)?.time}m
        </text>
      </motion.g>
    </svg>
  )
}

// Step-by-step directions
const DIRECTIONS = {
  walk: [
    { icon: '↑', text: 'Head north on Ibaraki-shi Eki St', dist: '200m' },
    { icon: '→', text: 'Turn right at the convenience store', dist: '350m' },
    { icon: '↑', text: 'Continue past AEON Mall', dist: '400m' },
    { icon: '★', text: 'Arrive at destination', dist: 'on left' },
  ],
  transit: [
    { icon: '→', text: 'Board Osaka Monorail at Ibaraki-shi', dist: '2 stops' },
    { icon: '↔', text: 'Transfer to Hankyu Kyoto Line', dist: 'Platform 3' },
    { icon: '★', text: 'Arrive at destination station', dist: '2 min walk' },
  ],
  bike: [
    { icon: '↑', text: 'Head north — cycle lane on right', dist: '300m' },
    { icon: '→', text: 'Right at Ritsumeikan Ave', dist: '500m' },
    { icon: '★', text: 'Lock bike at designated stand', dist: 'on left' },
  ],
  car: [
    { icon: '↑', text: 'Depart and merge onto Meishin Expressway', dist: '1.2km' },
    { icon: '⬆', text: 'Take exit 14B — Ibaraki East', dist: '400m' },
    { icon: '★', text: 'Destination parking on right', dist: 'B1F' },
  ],
  taxi: [
    { icon: 'TX', text: 'Share ride code with driver: OUJ-84', dist: '' },
    { icon: '↑', text: 'Route via Meiwa Dori', dist: '1.8km' },
    { icon: '★', text: 'Drop-off in front of venue', dist: 'Main entrance' },
  ],
}

export default function NaviOverlay({ target, onClose }) {
  const { naviTransportMode: mode, setNaviTransportMode, theme } = useStore()
  const t = getTheme(theme)
  const [started, setStarted] = useState(false)
  const [showDirections, setShowDirections] = useState(false)
  const modeData = TRANSPORT_MODES.find(m => m.id === mode) || TRANSPORT_MODES[0]
  const steps = DIRECTIONS[mode] || DIRECTIONS.walk

  return (
    <motion.div
      className="absolute inset-0 z-[100] flex flex-col"
      style={{ background: t.bg }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 38 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-safe-top"
        style={{ paddingTop: 'max(52px, env(safe-area-inset-top))', paddingBottom: 12,
          background: `linear-gradient(to bottom, ${t.bg} 0%, transparent 100%)` }}>
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: t.surface, border: `1px solid ${t.border}` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="text-center">
          <p className="font-display font-black text-sm" style={{ color: t.text }}>{target?.name || 'Navigate'}</p>
          <p className="text-xs" style={{ color: t.textMuted }}>{target?.address || 'Select destination'}</p>
        </div>
        <button onClick={() => setShowDirections(!showDirections)}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: t.brandBg, border: `1px solid ${t.brandGlow}` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.brand} strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      </div>

      {/* Map area */}
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: 200, maxHeight: 220 }}>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <AnimatedRoute mode={mode} />
        </div>
        {/* Distance/time badge */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-3 left-4 px-3 py-1.5 rounded-full flex items-center gap-2"
          style={{ background: modeData.color + '22', border: `1px solid ${modeData.color}44`, backdropFilter: 'blur(12px)' }}>
          <modeData.icon size={14} color={modeData.color}/>
          <span className="font-display font-bold text-xs" style={{ color: modeData.color }}>
            {modeData.time} min · {modeData.dist}
          </span>
        </motion.div>
      </div>

      {/* Transport mode selector */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scroll">
          {TRANSPORT_MODES.map(m => {
            const active = mode === m.id
            return (
              <motion.button
                key={m.id}
                onClick={() => setNaviTransportMode(m.id)}
                whileTap={{ scale: 0.92 }}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl transition-all"
                style={{
                  background: active ? m.color + '22' : t.surface,
                  border: `1.5px solid ${active ? m.color : t.border}`,
                  minWidth: 64,
                }}>
                <m.icon size={20} color={active ? m.color : t.textMuted}/>
                <span className="font-display font-bold text-[10px]" style={{ color: active ? m.color : t.textMuted }}>
                  {m.label}
                </span>
                <span className="font-mono text-[9px]" style={{ color: active ? m.color : t.textFaint }}>
                  {m.time}m
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Mode detail card */}
      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="mx-4 rounded-2xl p-4 mb-3"
          style={{ background: t.surface, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <modeData.icon size={22} color={modeData.color}/>
              <div>
                <p className="font-display font-black text-sm" style={{ color: t.text }}>{modeData.label}</p>
                <p className="text-xs" style={{ color: t.textMuted }}>
                  {modeData.fare || modeData.cal ? (modeData.fare ? `Cost: ${modeData.fare}` : `${modeData.cal} cal`) : modeData.info}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display font-black text-xl" style={{ color: modeData.color }}>{modeData.time}m</p>
              <p className="text-xs" style={{ color: t.textMuted }}>{modeData.dist}</p>
            </div>
          </div>

          {/* Step by step */}
          <AnimatePresence>
            {(showDirections || started) && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="space-y-2 border-t pt-3" style={{ borderColor: t.border }}>
                  {steps.map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                        style={{ background: modeData.color + '22', color: modeData.color, fontWeight: 700 }}>
                        {step.icon}
                      </div>
                      <p className="flex-1 text-xs" style={{ color: t.text }}>{step.text}</p>
                      <span className="text-[10px] font-mono" style={{ color: t.textMuted }}>{step.dist}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Start button */}
      <div className="px-4 pb-safe" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setStarted(true)}
          className="w-full py-4 rounded-2xl font-display font-black text-base text-white"
          style={{
            background: started
              ? `linear-gradient(135deg, ${modeData.color}, ${modeData.color}cc)`
              : `linear-gradient(135deg, ${t.brand}, ${t.accent})`,
            boxShadow: `0 8px 32px ${(started ? modeData.color : t.brand)}44`,
            letterSpacing: '-0.02em',
          }}>
          {started ? `Navigating via ${modeData.label} · ${modeData.time} min` : `Start ${modeData.label} Navigation`}
        </motion.button>
      </div>
    </motion.div>
  )
}
