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
    dates: 'May 15 – May 25',
    checkIn: '3:00 PM',
    checkOut: '10:00 AM',
    rating: 4.8,
    lat: 34.8154,
    lng: 135.5686,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    ],
    priceText: 'Included in Tuition',
    description: 'Live on campus at Ritsumeikan\'s Osaka Ibaraki Campus (OIC). A modern seminar house designed for international programs with shared common areas. This marks the beginning of your academic journey in Japan.',
    amenities: ['Campus WiFi', 'Study Lounges', 'Shared Kitchen', 'Laundry'],
    hostImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Ritsumeikan_University_logo.svg/1200px-Ritsumeikan_University_logo.svg.png',
    tags: ['Student Life', 'Campus'],
    roomiesOptions: [
      { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=1' },
      { id: '2', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=2' },
      { id: '3', name: 'Mike Davis', avatar: 'https://i.pravatar.cc/150?u=3' },
    ]
  },
  {
    id: 'kyoto-hotel',
    name: 'Kyoto Program Hotel',
    subtitle: 'Professional Hospitality',
    location: 'Kyoto, Japan',
    type: 'Hotel',
    nights: 11,
    dates: 'May 25 – Jun 5',
    checkIn: '4:00 PM',
    checkOut: '11:00 AM',
    rating: 4.9,
    lat: 35.0116,
    lng: 135.7681,
    images: [
      'https://images.unsplash.com/photo-1578469645742-46cae010e5d4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    ],
    priceText: 'Included in Tuition',
    description: 'A comfortable hotel in the heart of Kyoto, walking distance from historic temples, Nishiki Market, and convenient transit connections. Explore the cultural capital of Japan with ease.',
    amenities: ['Daily Housekeeping', 'Breakfast', 'Lobby WiFi'],
    hostImage: 'https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&q=80&w=200',
    tags: ['Culture', 'Historic District'],
    roomiesOptions: [
      { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=1' },
      { id: '4', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=4' },
    ]
  },
  {
    id: 'tokyo-hotel',
    name: 'Tokyo Base',
    subtitle: 'Managed by OU Study Abroad',
    location: 'Tokyo, Japan',
    type: 'Hotel',
    nights: 3,
    dates: 'Jun 5 – Jun 8',
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    rating: 4.7,
    lat: 35.6762,
    lng: 139.6503,
    images: [
      'https://images.unsplash.com/photo-1542051812-f4539618b14a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    ],
    priceText: 'Included in Tuition',
    description: 'A modern hotel in central Tokyo near major business districts and world-famous landmarks. Perfect base for the final leg of the program where you will visit cutting-edge companies.',
    amenities: ['Free WiFi', 'City Panorama', 'Luggage Storage'],
    hostImage: null,
    tags: ['Metropolis', 'Shopping'],
    roomiesOptions: [
      { id: '2', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=2' },
      { id: '5', name: 'David Lee', avatar: 'https://i.pravatar.cc/150?u=5' },
    ]
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Stays', icon: '🏠' },
  { id: 'apartments', label: 'Apartments', icon: '🏢' },
  { id: 'hotels', label: 'Hotels', icon: '🏨' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'campus', label: 'Campus', icon: '🎓' },
]

function StayCard({ stay, selected, onSelect, onNavigateToMap, index }) {
  const [selectedRoomie, setSelectedRoomie] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
      className="relative cursor-pointer group"
      onClick={() => onSelect(selected ? null : stay)}
    >
      {/* Image Slider */}
      <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 shadow-lg border" style={{ borderColor: 'var(--border)' }}>
        <img src={stay.images[0]} alt={stay.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

        {/* Top gradient for buttons */}
        <div className="absolute inset-0 top-0 h-24" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }} />

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 text-white p-1 hover:scale-110 active:scale-90 transition-transform">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.4)', height: '26px', width: '26px', stroke: 'white', strokeWidth: 2, overflow: 'visible' }}><path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path></svg>
        </button>

        {/* Japanese Badge Tags */}
        {stay.tags && stay.tags[0] && (
          <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
            <div className="px-3 py-1.5 rounded-full font-display font-bold text-[10px] text-white shadow-sm backdrop-blur-md"
              style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {stay.tags[0]}
            </div>
            <div className="px-3 py-1.5 rounded-full font-display font-bold text-[10px] text-white shadow-sm backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {stay.type}
            </div>
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
          <h3 className="font-display font-extrabold text-[16px] m-0 leading-snug" style={{ color: 'var(--text)' }}>{stay.location}</h3>
          <p className="font-body text-[14px] m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>{stay.subtitle}</p>
          <p className="font-body text-[14px] m-0" style={{ color: 'var(--text-muted)' }}>{stay.dates}</p>
          <p className="font-body text-[14px] m-0 mt-1.5"><span className="font-extrabold" style={{ color: 'var(--text)' }}>{stay.priceText}</span></p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5" style={{ color: 'var(--text)' }}>
          <IcStar size={13} color="var(--text)" style={{ fill: 'var(--text)' }} />
          <span className="font-body text-[14px] font-bold">{stay.rating}</span>
        </div>
      </div>

      {/* Expandable Details Container */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4 pt-4 border-t relative" style={{ borderColor: 'var(--border)' }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Explicit Close Button */}
            <div className="absolute top-4 right-0 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); onSelect(null); }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 text-gray-500"
                style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Stay Info & Details (Where, Dates, Times) */}
            <div className="flex gap-4 mb-5 p-4 rounded-xl border shadow-sm" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-display font-black tracking-widest mb-1.5" style={{ color: 'var(--text-dim)' }}>Dates</p>
                <p className="text-sm font-bold font-body m-0" style={{ color: 'var(--text)' }}>{stay.dates}</p>
                <p className="text-xs font-body m-0 mt-0.5" style={{ color: 'var(--brand)' }}>{stay.nights} Nights</p>
              </div>
              <div className="w-[1px]" style={{ background: 'var(--border)' }} />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-display font-black tracking-widest mb-1.5" style={{ color: 'var(--text-dim)' }}>Times</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-500/10 text-green-600 rounded">IN</span>
                  <p className="text-xs font-bold font-body m-0" style={{ color: 'var(--text)' }}>{stay.checkIn}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-500/10 text-red-600 rounded">OUT</span>
                  <p className="text-xs font-bold font-body m-0" style={{ color: 'var(--text)' }}>{stay.checkOut}</p>
                </div>
              </div>
            </div>

            {/* Information of what the trip is about */}
            <div className="mb-5">
              <h4 className="text-[10px] font-display font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>About the Trip Segment</h4>
              <p className="text-sm leading-relaxed font-body m-0" style={{ color: 'var(--text-muted)' }}>{stay.description}</p>
            </div>

            <div className="mb-6 flex gap-1.5 flex-wrap">
              {stay.amenities.map(a => (
                <span key={a} className="px-3 py-1.5 rounded-lg text-[11px] font-body font-bold" style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}>{a}</span>
              ))}
            </div>

            {/* Roommate Selection Area (Who's staying) */}
            {stay.roomiesOptions && (
              <div className="mb-6">
                <h4 className="text-[10px] font-display font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>Who's Staying? (Roommate Preferences)</h4>
                <div className="space-y-2">
                  {stay.roomiesOptions.map(roomie => (
                    <div
                      key={roomie.id}
                      onClick={() => setSelectedRoomie(selectedRoomie === roomie.id ? null : roomie.id)}
                      className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all"
                      style={{
                        background: selectedRoomie === roomie.id ? 'var(--brand-glow)' : 'var(--surface2)',
                        borderColor: selectedRoomie === roomie.id ? 'var(--brand)' : 'var(--border)'
                      }}>
                      <div className="flex items-center gap-3">
                        <img src={roomie.avatar} alt={roomie.name} className="w-10 h-10 rounded-full border shadow-sm" style={{ borderColor: 'var(--border)' }} />
                        <span className="font-bold text-sm font-body" style={{ color: 'var(--text)' }}>{roomie.name}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full border flex items-center justify-center transition-colors"
                        style={{
                          borderColor: selectedRoomie === roomie.id ? 'var(--brand)' : 'var(--border)',
                          background: selectedRoomie === roomie.id ? 'var(--brand)' : 'transparent'
                        }}>
                        {selectedRoomie === roomie.id && <IcCheck size={12} color="white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions (Maps Integrated) */}
            <div className="flex gap-2 mb-2">
              <button
                onClick={(e) => { e.stopPropagation(); onNavigateToMap?.({ name: stay.name, lat: stay.lat, lng: stay.lng, icon: '🏠' }) }}
                className="flex-[2] py-3.5 px-4 rounded-xl font-display font-bold text-[13px] text-white text-center shadow-lg active:scale-95 transition-transform"
                style={{ background: 'var(--brand)' }}
              >
                📍 Navigate via Maps
              </button>
              <button
                className="flex-[1] py-3.5 px-4 rounded-xl font-display font-bold text-[13px] text-center border active:scale-95 transition-transform"
                style={{ background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' }}
              >
                ✉️ Contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function HousingView({ onNavigateToMap }) {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedStay, setSelectedStay] = useState(null)

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-6" style={{ color: 'var(--text)' }}>
      {/* ── Search Pill (Airbnb Style) ─────────────────────── */}
      <div className="sticky top-4 z-20">
        <button className="w-full flex items-center justify-between rounded-full px-5 py-3 border active:scale-[0.98] transition-all bg-white/90 backdrop-blur-xl"
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
      <div className="flex gap-4 overflow-x-auto hide-scroll -mx-4 px-4 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
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
      <div className="grid grid-cols-1 gap-6">
        {STAYS.map((stay, i) => (
          <StayCard
            key={stay.id}
            stay={stay}
            index={i}
            selected={selectedStay?.id === stay.id}
            onSelect={setSelectedStay}
            onNavigateToMap={onNavigateToMap}
          />
        ))}
      </div>
    </div>
  )
}
