import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IcStar, IcCheck, IcHalal } from './ui/Icons'

const STAYS = [
  {
    id: 'oic',
    name: 'OIC Seminar House',
    subtitle: 'Hosted by Ritsumeikan University',
    location: 'Ibaraki, Osaka',
    type: 'Residence Hall',
    nights: 10,
    rating: 4.8,
    lat: 34.8154,
    lng: 135.5686,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    ],
    priceText: 'Included in Tuition',
    description: 'Live on campus at Ritsumeikan\'s Osaka Ibaraki Campus (OIC). A modern seminar house designed for international programs with shared common areas.',
    amenities: ['Campus WiFi', 'Study Lounges', 'Shared Kitchen', 'Laundry', 'Gym'],
    hostImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Ritsumeikan_University_logo.svg/1200px-Ritsumeikan_University_logo.svg.png',
    tags: ['Student Life', 'Campus'],
  },
  {
    id: 'kyoto-hotel',
    name: 'Kyoto Program Hotel',
    subtitle: 'Professional Hospitality',
    location: 'Kyoto, Japan',
    type: 'Hotel',
    nights: 11,
    rating: 4.9,
    lat: 35.0116,
    lng: 135.7681,
    images: [
      'https://images.unsplash.com/photo-1578469645742-46cae010e5d4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    ],
    priceText: 'Included in Tuition',
    description: 'A comfortable hotel in the heart of Kyoto, walking distance from historic temples, Nishiki Market, and convenient transit connections.',
    amenities: ['Daily Housekeeping', 'Breakfast', 'Lobby WiFi', 'Luggage Storage'],
    hostImage: 'https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&q=80&w=200',
    tags: ['Culture', 'Historic District'],
  },
  {
    id: 'tokyo-hotel',
    name: 'Tokyo Base',
    subtitle: 'Managed by OU Study Abroad',
    location: 'Tokyo, Japan',
    type: 'Hotel',
    nights: 3,
    rating: 4.7,
    lat: 35.6762,
    lng: 139.6503,
    images: [
      'https://images.unsplash.com/photo-1542051812-f4539618b14a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    ],
    priceText: 'Included in Tuition',
    description: 'A modern hotel in central Tokyo near major business districts and world-famous landmarks. Perfect base for the final leg of the program.',
    amenities: ['Free WiFi', '24hr Front Desk', 'City Panorama', 'Luggage Storage'],
    hostImage: null,
    tags: ['Metropolis', 'Shopping'],
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Stays', icon: '🏠' },
  { id: 'apartments', label: 'Apartments', icon: '🏢' },
  { id: 'hotels', label: 'Hotels', icon: '🏨' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'campus', label: 'Campus', icon: '🎓' },
]

export default function HousingView({ onNavigateToMap }) {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="min-h-full pb-20" style={{ color: 'var(--text)' }}
    >
      {/* ── Search Pill (Airbnb Style) ─────────────────────── */}
      <div className="pt-2 px-5 pb-4 sticky top-0 z-20 backdrop-blur-md" style={{ background: 'linear-gradient(to bottom, var(--bg) 60%, transparent 100%)' }}>
        <button className="w-full flex items-center justify-between rounded-full px-5 py-3 border active:scale-[0.98] transition-all"
          style={{ background: 'var(--surface2)', borderColor: 'var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-4">
            <span className="text-xl">🔍</span>
            <div className="text-left">
              <p className="text-sm font-display font-black m-0 leading-tight">Where to?</p>
              <p className="text-xs font-body m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>Anywhere · Any week · Add guests</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <span className="text-xs" style={{ color: 'var(--text)' }}>⚙️</span>
          </div>
        </button>
      </div>

      {/* ── Tabs (Apple Style Horizontal Scroll) ─────────────────────────────── */}
      <div className="flex overflow-x-auto hide-scroll gap-7 px-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0 transition-opacity active:scale-95"
            style={{ opacity: activeTab === cat.id ? 1 : 0.45 }}
          >
            <span className="text-2xl mb-1">{cat.icon}</span>
            <span className="text-[11px] font-body font-bold pb-2 transition-all"
              style={{ borderBottom: activeTab === cat.id ? '2px solid var(--text)' : '2px solid transparent' }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Properties List (Cinematic Cards) ────────────────── */}
      <div className="px-5 pt-7 space-y-10">
        {STAYS.map((stay, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
            key={stay.id}
            className="relative cursor-pointer group"
            onClick={() => onNavigateToMap?.({ name: stay.name, lat: stay.lat, lng: stay.lng, icon: '🏠' })}
          >
            {/* Image Slider */}
            <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 shadow-lg">
              <img src={stay.images[0]} alt={stay.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

              {/* Top gradient for buttons */}
              <div className="absolute inset-0 top-0 h-24" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)' }} />

              {/* Favorite Button */}
              <button className="absolute top-4 right-4 text-white p-1 hover:scale-110 active:scale-90 transition-transform">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '26px', width: '26px', stroke: 'white', strokeWidth: 2, overflow: 'visible' }}><path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path></svg>
              </button>

              {/* Japanese Badge Tag */}
              {stay.tags && stay.tags[0] && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full font-display font-bold text-[10px] text-white shadow-sm backdrop-blur-md"
                  style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {stay.tags[0]}
                </div>
              )}

              {/* Bottom gradient and Pagination Dots */}
              <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                {stay.images.map((_, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === 0 ? 'bg-white' : 'bg-white/40'}`} />
                ))}
              </div>

              {/* Host Avatar if available (Overlapping Apple Style) */}
              {stay.hostImage && (
                <div className="absolute -bottom-5 right-5 w-14 h-14 rounded-full border-[3px] shadow-xl overflow-hidden z-20" style={{ borderColor: 'var(--bg)', background: 'var(--surface)' }}>
                  <img src={stay.hostImage} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Info Layout matches Airbnb precisely */}
            <div className="flex justify-between items-start pr-14">
              <div className="flex flex-col">
                <h3 className="font-display font-extrabold text-[16px] m-0 leading-snug">{stay.location}</h3>
                <p className="font-body text-[14px] m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>{stay.subtitle}</p>
                <p className="font-body text-[14px] m-0" style={{ color: 'var(--text-muted)' }}>{stay.nights} nights in Japan</p>
                <p className="font-body text-[14px] m-0 mt-1.5"><span className="font-extrabold" style={{ color: 'var(--text)' }}>{stay.priceText}</span></p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                <IcStar size={13} color="var(--text)" style={{ fill: 'var(--text)' }} />
                <span className="font-body text-[14px] font-bold">{stay.rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
