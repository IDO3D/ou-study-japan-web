// components/HousingView.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STAYS = [
  {
    id: 'oic',
    name: 'OIC Seminar House',
    subtitle: 'Ritsumeikan University',
    type: 'Residence Hall',
    city: 'Ibaraki City, Osaka',
    nights: 10,
    lat: 34.8154,
    lng: 135.5686,
    emoji: '🏫',
    color: '#E02424',
    colorBg: 'rgba(224,36,36,0.12)',
    colorBorder: 'rgba(224,36,36,0.25)',
    description: 'Live on campus at Ritsumeikan\'s Osaka Ibaraki Campus (OIC). A modern seminar house designed for international programs with shared common areas.',
    amenities: ['Campus WiFi', 'Study Lounges', 'Shared Kitchen', 'Laundry', 'Campus Gym Access', 'Cafeteria Nearby'],
    roommates: '1–2 roommates',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
    panorama: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
    mapZoom: 14,
    googleMapsUrl: 'https://maps.google.com/?q=Ritsumeikan+University+OIC+Campus+Ibaraki+Osaka',
    welcome: {
      jp: 'ようこそ、OICセミナーハウスへ！',
      rom: 'Yōkoso, OIC Seminaa Hausu e!',
      en: 'Welcome to the OIC Seminar House!',
      tips: [
        'Shoes off at the entrance — use the provided slippers',
        'Quiet hours after 10pm — thin walls!',
        'IC card works for laundry machines (¥100/wash)',
        'Campus convenience store closes at 10pm',
        'Nearest station: Ibaraki-shi (JR Kyoto Line) · 5 min walk',
      ],
    },
  },
  {
    id: 'kyoto-hotel',
    name: 'Kyoto Program Hotel',
    subtitle: 'Central Kyoto',
    type: 'Hotel',
    city: 'Kyoto, Japan',
    nights: 11,
    lat: 35.0116,
    lng: 135.7681,
    emoji: '🏯',
    color: '#4F46E5',
    colorBg: 'rgba(79,70,229,0.12)',
    colorBorder: 'rgba(79,70,229,0.25)',
    description: 'A comfortable hotel in the heart of Kyoto, walking distance from historic temples, Nishiki Market, and convenient transit connections.',
    amenities: ['Daily Housekeeping', 'Hotel Breakfast', 'Lobby WiFi', 'Luggage Storage', 'Concierge', 'City Views'],
    roommates: '1 roommate (twin room)',
    image: 'https://images.unsplash.com/photo-1578469645742-46cae010e5d4?auto=format&fit=crop&q=80&w=800',
    panorama: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&q=80&w=1200',
    mapZoom: 14,
    googleMapsUrl: 'https://maps.google.com/?q=Kyoto+Japan+hotel',
    welcome: {
      jp: 'ようこそ、京都へ！',
      rom: 'Yōkoso, Kyōto e!',
      en: 'Welcome to Kyoto!',
      tips: [
        'Most temples open 8am–5pm — arrive early to avoid crowds',
        'IC card (Suica/ICOCA) works on all Kyoto buses',
        'Nishiki Market is 3 blocks east — try the street food!',
        'Geisha sightings in Gion district (evening, be respectful)',
        'Nearest subway: Kyoto Station or Gion-Shijo',
      ],
    },
  },
  {
    id: 'tokyo-hotel',
    name: 'Tokyo Program Hotel',
    subtitle: 'Central Tokyo',
    type: 'Hotel',
    city: 'Tokyo, Japan',
    nights: 3,
    lat: 35.6762,
    lng: 139.6503,
    emoji: '🗼',
    color: '#10B981',
    colorBg: 'rgba(16,185,129,0.12)',
    colorBorder: 'rgba(16,185,129,0.25)',
    description: 'A modern hotel in central Tokyo near major business districts and world-famous landmarks. Perfect base for the final leg of the program.',
    amenities: ['Free WiFi', 'Restaurant', '24hr Front Desk', 'Fitness Center', 'City Panorama', 'Luggage Storage'],
    roommates: '1 roommate (twin room)',
    image: 'https://images.unsplash.com/photo-1542051812-f4539618b14a?auto=format&fit=crop&q=80&w=800',
    panorama: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&q=80&w=1200',
    mapZoom: 13,
    googleMapsUrl: 'https://maps.google.com/?q=Tokyo+Japan+hotel',
    welcome: {
      jp: 'ようこそ、東京へ！',
      rom: 'Yōkoso, Tōkyō e!',
      en: 'Welcome to Tokyo!',
      tips: [
        'Suica card works everywhere in Tokyo — top up at any JR station',
        'Tokyo Metro Day Pass (¥600) is great for sightseeing days',
        'Convenience stores (7-Eleven, FamilyMart) open 24/7',
        'Shibuya Crossing is a 10-minute train ride from most hotels',
        'Download Google Maps offline before arriving',
      ],
    },
  },
]

// 3D Panorama Viewer (CSS 3D + JS drag)
function PanoramaViewer({ image, name }) {
  const containerRef = useRef(null)
  const [drag, setDrag] = useState({ active: false, startX: 0, rotY: -20 })
  const [rotY, setRotY] = useState(-20)

  const onDown = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX
    setDrag({ active: true, startX: x, rotY })
  }
  const onMove = (e) => {
    if (!drag.active) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const delta = (x - drag.startX) * 0.4
    setRotY(drag.rotY + delta)
  }
  const onUp = () => setDrag(d => ({ ...d, active: false, rotY }))

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{ height: '200px', background: '#000', cursor: drag.active ? 'grabbing' : 'grab' }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
    >
      {/* Simulated panorama by moving a wide image */}
      <div
        style={{
          width: '200%',
          height: '100%',
          transform: `translateX(${(rotY % 360) * 0.15}px)`,
          transition: drag.active ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <span className="text-[10px] font-display font-bold text-white">↔ Drag to explore</span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          <span className="text-[10px] font-display text-white/60">360° View</span>
        </div>
      </div>
    </div>
  )
}

// Mini Static Map (OpenStreetMap tile)
function StaticMap({ lat, lng, name, zoom = 14 }) {
  const tileX = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom))
  const tileY = Math.floor(
    (1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
      2 * Math.pow(2, zoom)
  )
  const tileUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: '140px', background: '#1a1a2e' }}>
      <img
        src={tileUrl}
        alt={`Map of ${name}`}
        className="w-full h-full object-cover"
        style={{ filter: 'brightness(0.75) saturate(0.8)' }}
        onError={(e) => { e.target.style.display = 'none' }}
      />
      {/* Center pin */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          <div className="w-5 h-5 rounded-full bg-brand border-2 border-white shadow-lg" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '6px solid #E02424' }} />
        </div>
      </div>
      <div className="absolute bottom-2 right-2">
        <span className="text-[9px] px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
          © OpenStreetMap
        </span>
      </div>
    </div>
  )
}

// Welcome Page slide-in
function WelcomePage({ stay, onClose }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ background: '#09090b' }}
    >
      {/* Hero image */}
      <div className="relative h-52 flex-shrink-0">
        <img src={stay.image} alt={stay.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #09090b 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
        <button
          onClick={onClose}
          className="absolute top-12 left-4 w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <span className="text-white text-sm">←</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scroll px-5 pb-8 -mt-6 relative z-10 space-y-5">
        {/* Welcome card */}
        <div className="p-6 rounded-3xl"
          style={{ background: stay.colorBg, border: `1px solid ${stay.colorBorder}` }}>
          <p className="font-jp text-xl text-white leading-relaxed mb-1">{stay.welcome.jp}</p>
          <p className="font-mono text-xs mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{stay.welcome.rom}</p>
          <p className="font-display font-black text-2xl text-white" style={{ letterSpacing: '-0.02em' }}>
            {stay.welcome.en}
          </p>
        </div>

        {/* Stay info */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Nights', value: stay.nights, icon: '🌙' },
            { label: 'City', value: stay.city.split(',')[0], icon: '📍' },
            { label: 'Type', value: stay.type, icon: '🏠' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-lg mb-1">{s.icon}</p>
              <p className="font-display font-black text-white text-sm">{s.value}</p>
              <p className="text-[9px] font-display uppercase tracking-wider mt-0.5"
                style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div>
          <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.3)' }}>Amenities</p>
          <div className="flex flex-wrap gap-2">
            {stay.amenities.map(a => (
              <span key={a} className="badge badge-sakura text-[10px]">✦ {a}</span>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.3)' }}>Local Tips</p>
          <div className="space-y-2">
            {stay.welcome.tips.map((tip, i) => (
              <div key={i} className="flex gap-2.5 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xs font-display font-black flex-shrink-0"
                  style={{ color: stay.color }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div>
          <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.3)' }}>Location</p>
          <StaticMap lat={stay.lat} lng={stay.lng} name={stay.name} zoom={stay.mapZoom} />
          <p className="text-[10px] text-center mt-2 font-display" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {stay.lat.toFixed(4)}, {stay.lng.toFixed(4)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function HousingView() {
  const [welcomeStay, setWelcomeStay] = useState(null)
  const [expandedId, setExpandedId] = useState('oic')

  const totalNights = STAYS.reduce((s, h) => s + h.nights, 0)

  return (
    <div className="relative" style={{ minHeight: '100%' }}>
      <div className="px-5 pb-6 space-y-5">

        {/* ── Header ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,183,197,0.15) 0%, rgba(18,18,20,0.97) 70%)',
            border: '1px solid rgba(255,183,197,0.25)',
          }}
        >
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-3xl"
            style={{ background: 'rgba(255,183,197,0.2)' }} />
          <p className="text-xs font-display font-bold uppercase tracking-widest mb-1"
            style={{ color: '#FFB7C5' }}>Your Accommodation</p>
          <h2 className="text-2xl font-display font-black text-white relative z-10">
            Housing Guide 🏠
          </h2>
          <p className="text-xs mt-1.5 relative z-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {totalNights} nights across 3 cities · 1–2 roommates
          </p>
          <div className="flex gap-3 mt-4 relative z-10">
            <div>
              <p className="font-display font-black text-white text-xl">{totalNights}</p>
              <p className="text-[10px] font-display uppercase tracking-wider"
                style={{ color: 'rgba(255,255,255,0.35)' }}>Total Nights</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <p className="font-display font-black text-white text-xl">{STAYS.length}</p>
              <p className="text-[10px] font-display uppercase tracking-wider"
                style={{ color: 'rgba(255,255,255,0.35)' }}>Properties</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <p className="font-display font-black text-white text-xl">2</p>
              <p className="text-[10px] font-display uppercase tracking-wider"
                style={{ color: 'rgba(255,255,255,0.35)' }}>Room Types</p>
            </div>
          </div>
        </motion.div>

        {/* ── Journey Timeline ─────────────────── */}
        <div>
          <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.3)' }}>Your Journey</p>
          <div className="relative pl-5">
            <div className="absolute left-2 top-2 bottom-2 w-[1px]"
              style={{ background: 'linear-gradient(to bottom, #E02424, #4F46E5, #10B981)' }} />
            {STAYS.map((stay, i) => (
              <div key={stay.id} className="flex items-center gap-3 mb-4 last:mb-0">
                <div className="w-4 h-4 rounded-full border-2 border-white flex-shrink-0 -ml-[calc(0.5rem+1px)]"
                  style={{ background: stay.color }} />
                <div>
                  <p className="font-display font-bold text-white text-sm">{stay.city}</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {stay.nights} nights · {stay.type}
                  </p>
                </div>
                <span className="ml-auto text-lg">{stay.emoji}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stay Cards ───────────────────────── */}
        {STAYS.map((stay, i) => {
          const isOpen = expandedId === stay.id
          return (
            <motion.div
              key={stay.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: 'rgba(18,18,20,0.95)', border: `1px solid ${stay.colorBorder}` }}
            >
              {/* Card Header */}
              <div className="relative h-44">
                <img src={stay.image} alt={stay.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
                <div className="absolute top-3 right-3">
                  <span className="badge text-[10px]"
                    style={{ background: stay.colorBg, color: stay.color, border: `1px solid ${stay.colorBorder}`, backdropFilter: 'blur(8px)' }}>
                    {stay.nights} nights
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display font-black text-white text-lg leading-tight">{stay.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {stay.subtitle} · {stay.city}
                  </p>
                </div>
              </div>

              {/* Actions Row */}
              <div className="px-4 py-3 flex gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => setExpandedId(isOpen ? null : stay.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-display font-bold transition-all active:scale-95"
                  style={{
                    background: isOpen ? stay.colorBg : 'rgba(255,255,255,0.07)',
                    color: isOpen ? stay.color : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${isOpen ? stay.colorBorder : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {isOpen ? '▲ Less' : '▼ Details'}
                </button>
                <button
                  onClick={() => setWelcomeStay(stay)}
                  className="flex-1 py-2 rounded-xl text-xs font-display font-bold transition-all active:scale-95 text-white"
                  style={{ background: stay.color, boxShadow: `0 4px 12px ${stay.colorBg}` }}
                >
                  🏠 Welcome Page
                </button>
              </div>

              {/* Expandable: 3D Viewer + Map */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-4 pb-5 pt-4 space-y-4">
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {stay.description}
                      </p>

                      {/* 3D Panorama */}
                      <div>
                        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-2"
                          style={{ color: 'rgba(255,255,255,0.3)' }}>360° Room View</p>
                        <PanoramaViewer image={stay.panorama} name={stay.name} />
                      </div>

                      {/* Map */}
                      <div>
                        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-2"
                          style={{ color: 'rgba(255,255,255,0.3)' }}>Location Map</p>
                        <StaticMap lat={stay.lat} lng={stay.lng} name={stay.name} zoom={stay.mapZoom} />
                      </div>

                      {/* Roommates */}
                      <div className="flex items-center gap-2 p-3 rounded-xl"
                        style={{ background: 'rgba(255,183,197,0.08)', border: '1px solid rgba(255,183,197,0.15)' }}>
                        <span className="text-base">👥</span>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                          Rooming: <span className="text-white font-semibold">{stay.roommates}</span>
                        </p>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1.5">
                        {stay.amenities.map(a => (
                          <span key={a} className="badge badge-blue text-[9px]">✦ {a}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* ── Welcome Page Overlay ─────────────── */}
      <AnimatePresence>
        {welcomeStay && (
          <WelcomePage stay={welcomeStay} onClose={() => setWelcomeStay(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
