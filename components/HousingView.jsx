import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    <div className="min-h-full pb-20" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* ── Search Pill ─────────────────────── */}
      <div className="pt-2 px-5 pb-4 sticky top-0 z-20" style={{ background: 'var(--bg)' }}>
        <button className="w-full flex items-center justify-between rounded-full bg-white px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100">
          <div className="flex items-center gap-4">
            <span className="text-lg text-black">🔍</span>
            <div className="text-left">
              <p className="text-sm font-display font-bold text-black m-0 leading-tight">Where to?</p>
              <p className="text-xs text-gray-500 font-body m-0">Anywhere · Any week · Add guests</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
            <span className="text-xs text-black">⚙️</span>
          </div>
        </button>
      </div>

      {/* ── Tabs ─────────────────────────────── */}
      <div className="flex overflow-x-auto hide-scroll gap-6 px-5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0 transition-opacity"
            style={{ opacity: activeTab === cat.id ? 1 : 0.4 }}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-[11px] font-body font-semibold pb-2" style={{ borderBottom: activeTab === cat.id ? '2px solid var(--text)' : '2px solid transparent' }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Properties List ────────────────── */}
      <div className="px-5 pt-6 space-y-8">
        {STAYS.map((stay, i) => (
          <div key={stay.id} className="relative cursor-pointer group" onClick={() => onNavigateToMap?.({ name: stay.name, lat: stay.lat, lng: stay.lng, icon: '🏠' })}>
            {/* Image Slider */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3">
              <img src={stay.images[0]} alt={stay.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white p-1 hover:scale-110 transition-transform">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'white', strokeWidth: 2, overflow: 'visible' }}><path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path></svg>
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {stay.images.map((_, idx) => (
                  <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}`} />
                ))}
              </div>

              {/* Host Avatar if available */}
              {stay.hostImage && (
                <div className="absolute -bottom-4 right-4 w-14 h-14 rounded-full border-[3px] shadow-sm overflow-hidden bg-white" style={{ borderColor: 'var(--bg)' }}>
                  <img src={stay.hostImage} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex justify-between items-start pr-12">
              <div>
                <h3 className="font-display font-semibold text-[15px] m-0 leading-tight truncate">{stay.location}</h3>
                <p className="font-body text-[14px] m-0 mt-0.5 opacity-60">{stay.subtitle}</p>
                <p className="font-body text-[14px] m-0 opacity-60">{stay.nights} nights in Japan</p>
                <p className="font-body text-[14px] m-0 mt-1"><span className="font-semibold">{stay.priceText}</span></p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                <span className="text-[13px]">★</span>
                <span className="font-body text-[14px]">{stay.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
