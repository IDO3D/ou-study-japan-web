// components/MapView.jsx
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../utils/store'
import { formatJpy } from '../utils/helpers'

const CITIES = [
  {
    id: 'ibaraki',
    name: 'Ibaraki City',
    subtitle: 'Osaka Prefecture',
    lat: 34.8154,
    lng: 135.5686,
    zoom: 13,
    emoji: '🏫',
    color: '#E02424',
    nights: 10,
    desc: 'OIC Seminar House · Ritsumeikan University',
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    subtitle: 'Kyoto Prefecture',
    lat: 35.0116,
    lng: 135.7681,
    zoom: 13,
    emoji: '🏯',
    color: '#4F46E5',
    nights: 11,
    desc: 'Historic temples, tea ceremonies & orientation tours',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    subtitle: 'Tokyo Metropolis',
    lat: 35.6762,
    lng: 139.6503,
    zoom: 12,
    emoji: '🗼',
    color: '#10B981',
    nights: 3,
    desc: 'Shibuya, Shinjuku, business site visits & final tours',
  },
]

const CITY_POIS = {
  ibaraki: [
    { name: 'OIC Seminar House', type: 'housing', lat: 34.8154, lng: 135.5686, icon: '🏫' },
    { name: 'Ibaraki-shi Station', type: 'transit', lat: 34.8147, lng: 135.5721, icon: '🚉' },
    { name: 'AEON Mall Ibaraki', type: 'food', lat: 34.8082, lng: 135.5737, icon: '🛍️' },
    { name: 'Ritsumeikan University OIC', type: 'edu', lat: 34.8160, lng: 135.5692, icon: '🎓' },
  ],
  kyoto: [
    { name: 'Kinkaku-ji (Golden Pavilion)', type: 'culture', lat: 35.0394, lng: 135.7292, icon: '⛩️' },
    { name: 'Fushimi Inari Shrine', type: 'culture', lat: 34.9671, lng: 135.7727, icon: '🦊' },
    { name: 'Nishiki Market', type: 'food', lat: 35.0050, lng: 135.7650, icon: '🍜' },
    { name: 'Kyoto Station', type: 'transit', lat: 34.9858, lng: 135.7588, icon: '🚉' },
    { name: 'Gion District', type: 'culture', lat: 35.0036, lng: 135.7780, icon: '🏮' },
    { name: "Philosopher's Path", type: 'culture', lat: 35.0271, lng: 135.7944, icon: '🌸' },
  ],
  tokyo: [
    { name: 'Shibuya Crossing', type: 'landmark', lat: 35.6595, lng: 139.7004, icon: '🚶' },
    { name: 'Senso-ji Temple', type: 'culture', lat: 35.7147, lng: 139.7966, icon: '⛩️' },
    { name: 'Shinjuku Station', type: 'transit', lat: 35.6900, lng: 139.7006, icon: '🚉' },
    { name: 'Tokyo Tower', type: 'landmark', lat: 35.6586, lng: 139.7454, icon: '🗼' },
    { name: 'Tsukiji Outer Market', type: 'food', lat: 35.6654, lng: 139.7706, icon: '🐟' },
    { name: 'Harajuku / Takeshita St', type: 'culture', lat: 35.6702, lng: 139.7027, icon: '🎨' },
  ],
}

const POI_TYPE_COLORS = {
  housing: '#E02424',
  transit: '#4F46E5',
  food: '#10B981',
  culture: '#FFB7C5',
  landmark: '#FCD34D',
  edu: '#60A5FA',
}

function CityStaticMap({ city, pois }) {
  const zoom = city.zoom
  const tileX = Math.floor(((city.lng + 180) / 360) * Math.pow(2, zoom))
  const tileY = Math.floor(
    (1 - Math.log(Math.tan((city.lat * Math.PI) / 180) + 1 / Math.cos((city.lat * Math.PI) / 180)) / Math.PI) /
    2 * Math.pow(2, zoom)
  )

  return (
    <div className="relative w-full rounded-3xl overflow-hidden" style={{ height: '240px', background: '#1a1a2e' }}>
      <img
        src={`https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`}
        alt={`Map of ${city.name}`}
        className="w-full h-full object-cover"
        style={{ filter: 'brightness(0.65) saturate(0.7) hue-rotate(210deg)' }}
        onError={(e) => { e.target.style.display = 'none' }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-xl"
            style={{ background: city.color, border: '3px solid white', boxShadow: `0 0 20px ${city.color}80` }}>
            {city.emoji}
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-display font-bold text-white"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
            {city.name}, {city.subtitle}
          </div>
        </div>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
        <span className="text-[10px] font-display font-bold text-white">{pois.length} places</span>
      </div>
      <div className="absolute bottom-1 right-2">
        <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.3)' }}>© OpenStreetMap</span>
      </div>
    </div>
  )
}

export default function MapView() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activeCity, setActiveCity] = useState('ibaraki')
  const [filter, setFilter] = useState('all')
  const [selectedPoi, setSelectedPoi] = useState(null)
  const { userLocation, restaurants } = useStore()

  const city = CITIES.find(c => c.id === activeCity)
  const pois = CITY_POIS[activeCity] || []
  const filteredPois = filter === 'all' ? pois : pois.filter(p => p.type === filter)

  const hasMapbox =
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN &&
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN.startsWith('pk.')

  useEffect(() => {
    if (!mapRef.current || !hasMapbox) return
    if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null }

    const initMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default
        await import('mapbox-gl/dist/mapbox-gl.css')
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [city.lng, city.lat],
          zoom: city.zoom,
          pitch: 35,
        })

        map.on('load', () => {
          setMapLoaded(true)
          mapInstance.current = map

          pois.forEach(poi => {
            const m = document.createElement('div')
            m.innerHTML = `<div style="background:${POI_TYPE_COLORS[poi.type] || '#E02424'};border:2px solid white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,0.4);">${poi.icon}</div>`
            new mapboxgl.Marker(m).setLngLat([poi.lng, poi.lat])
              .setPopup(new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(
                `<div style="font-family:'DM Sans',sans-serif;padding:8px;"><p style="font-weight:700;font-size:13px;margin:0 0 3px;">${poi.icon} ${poi.name}</p><p style="color:${POI_TYPE_COLORS[poi.type]};font-size:11px;margin:0;text-transform:capitalize;">${poi.type}</p></div>`
              )).addTo(map)
          })
        })
      } catch (err) { console.error('Map error:', err) }
    }
    initMap()
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null } }
  }, [activeCity])

  useEffect(() => {
    if (mapInstance.current && city) {
      mapInstance.current.flyTo({ center: [city.lng, city.lat], zoom: city.zoom, duration: 1200 })
    }
  }, [activeCity, city])

  const filterTypes = ['all', ...new Set(pois.map(p => p.type))]
  const filterIcons = { all: '🗺️', transit: '🚉', food: '🍜', culture: '⛩️', landmark: '📍', housing: '🏠', edu: '🎓' }

  return (
    <div className="px-5 pb-6 space-y-4">

      {/* ── City Selector ─────────────────────── */}
      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Program Cities — 24 Nights Total</p>
        <div className="grid grid-cols-3 gap-2">
          {CITIES.map(c => (
            <button
              key={c.id}
              onClick={() => { setActiveCity(c.id); setSelectedPoi(null); setFilter('all') }}
              className="p-3 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-95"
              style={{
                background: activeCity === c.id ? c.color : 'rgba(255,255,255,0.06)',
                border: `1px solid ${activeCity === c.id ? c.color : 'rgba(255,255,255,0.08)'}`,
                boxShadow: activeCity === c.id ? `0 4px 16px ${c.color}50` : 'none',
              }}
            >
              <span className="text-xl">{c.emoji}</span>
              <p className="text-[10px] font-display font-bold text-white leading-tight text-center">{c.name}</p>
              <p className="text-[9px]" style={{ color: activeCity === c.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>
                {c.nights}n
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── City Banner ───────────────────────── */}
      <motion.div
        key={activeCity}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-4 rounded-2xl flex items-center gap-3"
        style={{ background: `${city.color}18`, border: `1px solid ${city.color}40` }}
      >
        <span className="text-3xl">{city.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-black text-white">{city.name}, {city.subtitle}</p>
          <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{city.desc}</p>
        </div>
        <span className="flex-shrink-0 px-2.5 py-1 rounded-xl text-xs font-display font-bold text-white"
          style={{ background: city.color }}>
          {city.nights}n
        </span>
      </motion.div>

      {/* ── Map ──────────────────────────────── */}
      <motion.div key={`map-${activeCity}`} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        {hasMapbox ? (
          <div className="relative rounded-3xl overflow-hidden" style={{ height: '240px' }}>
            <div ref={mapRef} className="w-full h-full" />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#09090b' }}>
                <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <CityStaticMap city={city} pois={pois} />
        )}
      </motion.div>

      {/* ── POI Filter ───────────────────────── */}
      <div className="flex gap-2 overflow-x-auto hide-scroll">
        {filterTypes.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-display font-bold transition-all active:scale-95"
            style={{
              background: filter === f ? '#E02424' : 'rgba(255,255,255,0.07)',
              color: filter === f ? 'white' : 'rgba(255,255,255,0.4)',
              border: filter === f ? '1px solid rgba(224,36,36,0.4)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {filterIcons[f] || '📌'} {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ── POI Cards ────────────────────────── */}
      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>
          {filteredPois.length} Places in {city.name}
        </p>
        <div className="space-y-2">
          {filteredPois.map((poi, i) => {
            const isSelected = selectedPoi?.name === poi.name
            return (
              <motion.div
                key={poi.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedPoi(isSelected ? null : poi)}
                className="flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-all"
                style={{
                  background: isSelected ? `${POI_TYPE_COLORS[poi.type]}15` : 'rgba(18,18,20,0.9)',
                  border: `1px solid ${isSelected ? POI_TYPE_COLORS[poi.type] + '45' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${POI_TYPE_COLORS[poi.type]}20` }}>
                  {poi.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-white text-sm truncate">{poi.name}</p>
                  <p className="text-[10px] capitalize" style={{ color: 'rgba(255,255,255,0.35)' }}>{poi.type}</p>
                </div>
                <div className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ background: POI_TYPE_COLORS[poi.type], opacity: 0.7 }} />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Full Journey Strip ───────────────── */}
      <div className="p-4 rounded-2xl"
        style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Full Itinerary</p>
        {CITIES.map((c) => (
          <div key={c.id} className="flex items-center gap-3 py-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-lg">{c.emoji}</span>
            <div className="flex-1">
              <p className="font-display font-semibold text-white text-xs">{c.name}</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{c.subtitle}</p>
            </div>
            <span className="font-display font-bold text-xs" style={{ color: c.color }}>{c.nights} nights</span>
          </div>
        ))}
        <div className="flex justify-between pt-3">
          <span className="font-display font-bold text-white text-sm">Total</span>
          <span className="font-display font-black text-gradient text-sm">24 Nights</span>
        </div>
      </div>
    </div>
  )
}
