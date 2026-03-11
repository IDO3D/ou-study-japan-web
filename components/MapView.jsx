// components/MapView.jsx — v5 Theme-aware with Navi integration
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'
import { getTheme } from '../utils/themes'
import NaviOverlay from './NaviOverlay'

const CITIES = [
  {
    id: 'ibaraki', name: 'Ibaraki City', subtitle: 'Osaka Prefecture',
    lat: 34.8154, lng: 135.5686, zoom: 13, label: 'OIC',
    color: '#E02424', nights: 10, desc: 'OIC Seminar House · Ritsumeikan University',
  },
  {
    id: 'kyoto', name: 'Kyoto', subtitle: 'Kyoto Prefecture',
    lat: 35.0116, lng: 135.7681, zoom: 13, label: 'KYO',
    color: '#4F46E5', nights: 11, desc: 'Historic temples, tea ceremonies & orientation tours',
  },
  {
    id: 'tokyo', name: 'Tokyo', subtitle: 'Tokyo Metropolis',
    lat: 35.6762, lng: 139.6503, zoom: 12, label: 'TYO',
    color: '#10B981', nights: 3, desc: 'Shibuya, Shinjuku, business site visits & final tours',
  },
]

const CITY_POIS = {
  ibaraki: [
    { name: 'OIC Seminar House', type: 'housing',  lat: 34.8154, lng: 135.5686 },
    { name: 'Ibaraki-shi Station', type: 'transit', lat: 34.8147, lng: 135.5721 },
    { name: 'AEON Mall Ibaraki',   type: 'food',    lat: 34.8082, lng: 135.5737 },
    { name: 'Ritsumeikan OIC',     type: 'edu',     lat: 34.8160, lng: 135.5692 },
    { name: 'FamilyMart',          type: 'konbini', lat: 34.8158, lng: 135.5680 },
    { name: 'Japan Post ATM',      type: 'atm',     lat: 34.8145, lng: 135.5710 },
  ],
  kyoto: [
    { name: 'Kinkaku-ji',          type: 'culture', lat: 35.0394, lng: 135.7292 },
    { name: 'Fushimi Inari Shrine',type: 'culture', lat: 34.9671, lng: 135.7727 },
    { name: 'Nishiki Market',      type: 'food',    lat: 35.0050, lng: 135.7650 },
    { name: 'Kyoto Station',       type: 'transit', lat: 34.9858, lng: 135.7588 },
    { name: 'Gion District',       type: 'culture', lat: 35.0036, lng: 135.7780 },
    { name: "Philosopher's Path",  type: 'nature',  lat: 35.0271, lng: 135.7944 },
    { name: 'Arashiyama Grove',    type: 'nature',  lat: 35.0095, lng: 135.6716 },
  ],
  tokyo: [
    { name: 'Shibuya Crossing',    type: 'landmark',lat: 35.6595, lng: 139.7004 },
    { name: 'Senso-ji Temple',     type: 'culture', lat: 35.7147, lng: 139.7966 },
    { name: 'Shinjuku Station',    type: 'transit', lat: 35.6900, lng: 139.7006 },
    { name: 'Tokyo Tower',         type: 'landmark',lat: 35.6586, lng: 139.7454 },
    { name: 'Tsukiji Outer Market',type: 'food',    lat: 35.6654, lng: 139.7706 },
    { name: 'Harajuku',            type: 'culture', lat: 35.6702, lng: 139.7027 },
    { name: 'Akihabara',           type: 'landmark',lat: 35.7022, lng: 139.7741 },
  ],
}

const POI_COLORS = {
  housing: '#E02424', transit: '#4F46E5', food: '#10B981',
  culture: '#FF4D7D', landmark: '#FCD34D', edu: '#60A5FA',
  nature: '#22c55e', konbini: '#f59e0b', atm: '#818CF8',
}

const POI_TYPE_LABELS = {
  housing:'Stay', transit:'Transit', food:'Food', culture:'Culture',
  landmark:'Landmark', edu:'Campus', nature:'Nature', konbini:'Konbini', atm:'ATM',
}

// SVG icon per POI type
function POIIcon({ type, size = 12 }) {
  const color = POI_COLORS[type] || '#E02424'
  const icons = {
    housing: <><rect x="3" y="10" width="18" height="10" rx="1"/><path d="M3 10L12 3l9 7"/></>,
    transit: <><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 10h16"/><circle cx="8.5" cy="16.5" r="1"/><circle cx="15.5" cy="16.5" r="1"/></>,
    food: <><path d="M7 2v20M7 2C7 2 3 5 3 10h4M7 2c0 0 4 3 4 8H7"/><path d="M21 2v6a4 4 0 01-4 4v10"/></>,
    culture: <><line x1="2" y1="7" x2="22" y2="7"/><line x1="4" y1="4" x2="20" y2="4"/><line x1="7" y1="7" x2="7" y2="22"/><line x1="17" y1="7" x2="17" y2="22"/></>,
    landmark: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    edu: <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></>,
    nature: <><path d="M17 8C8 10 5.9 16.17 3.82 22M9.1 17.4C8.2 16.06 6.3 14.6 3 14"/><path d="M14.5 4c-1.5 0-3 1-4.5 3C8.5 9 3 9 3 9c0 0 6 4 8 9M21 4c-1.14 3.36-3 5-3 5"/></>,
    konbini: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3.5a.5.5 0 011 0v1a.5.5 0 001 0v-1a.5.5 0 011 0V7"/><line x1="3" y1="12" x2="21" y2="12"/></>,
    atm: <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h2M12 15h5"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[type] || icons.landmark}
    </svg>
  )
}

// OSM tile map
function CityMap({ city, pois, color, onPoiClick }) {
  const zoom = city.zoom
  const tileX = Math.floor(((city.lng + 180) / 360) * Math.pow(2, zoom))
  const tileY = Math.floor((1 - Math.log(Math.tan(city.lat * Math.PI / 180) + 1 / Math.cos(city.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))

  const tileToPixel = (lat, lng) => {
    const tileSize = 256
    const cols = 3, rows = 2
    const totalW = tileSize * cols, totalH = tileSize * rows
    const originTileX = tileX - 1, originTileY = tileY
    const poiTileX = ((lng + 180) / 360) * Math.pow(2, zoom)
    const poiTileY = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)
    const px = (poiTileX - originTileX) * tileSize
    const py = (poiTileY - originTileY) * tileSize
    return { x: (px / totalW) * 100, y: (py / totalH) * 100 }
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: 240 }}>
      {/* Tiles */}
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: 'repeat(3,33.34%)', gridTemplateRows: 'repeat(2,50%)' }}>
        {[[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]].map(([dx,dy],i) => (
          <img key={i}
            src={`https://tile.openstreetmap.org/${zoom}/${tileX+dx}/${tileY+dy}.png`}
            className="w-full h-full object-cover" alt=""
            style={{ filter: 'invert(0.88) hue-rotate(190deg) saturate(0.6) brightness(0.6)' }}
            loading="lazy"
          />
        ))}
      </div>
      {/* Overlay gradient */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)` }}/>

      {/* POI markers */}
      {pois.map((poi, i) => {
        const { x, y } = tileToPixel(poi.lat, poi.lng)
        if (x < 0 || x > 100 || y < 0 || y > 100) return null
        const poiColor = POI_COLORS[poi.type] || color
        return (
          <motion.button key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: i * 0.06, type: 'spring' }}
            onClick={() => onPoiClick(poi)}
            className="absolute flex flex-col items-center"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-100%)', zIndex: 10 }}>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full mb-0.5"
              style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', border: `1px solid ${poiColor}66` }}>
              <POIIcon type={poi.type} size={10}/>
              <span className="text-[9px] font-display font-bold text-white whitespace-nowrap"
                style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {poi.name.length > 14 ? poi.name.slice(0, 13) + '…' : poi.name}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ background: poiColor, boxShadow: `0 0 6px ${poiColor}` }}/>
          </motion.button>
        )
      })}

      {/* City center pulse */}
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
        <motion.div className="absolute rounded-full" style={{ width: 40, height: 40, background: color + '33', top: -20, left: -20 }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }}/>
        <div className="w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: color, boxShadow: `0 0 16px ${color}99`, border: '2px solid white' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-white"/>
        </div>
      </div>

      {/* OSM attribution */}
      <div className="absolute bottom-1.5 right-2">
        <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.3)' }}>© OpenStreetMap</span>
      </div>
    </div>
  )
}

// Mapbox 3D version
function MapboxMap({ city, pois, color, onPoiClick }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!ref.current || !token?.startsWith('pk.')) return
    let map
    const init = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default
        mapboxgl.accessToken = token
        map = new mapboxgl.Map({
          container: ref.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [city.lng, city.lat],
          zoom: city.zoom,
          pitch: 52,
          bearing: -15,
          antialias: true,
        })
        map.on('load', () => {
          setLoaded(true)
          mapRef.current = map
          map.addLayer({
            id: '3d-buildings', source: 'composite', 'source-layer': 'building',
            filter: ['==', 'extrude', 'true'], type: 'fill-extrusion', minzoom: 14,
            paint: { 'fill-extrusion-color': '#1a1a2e', 'fill-extrusion-height': ['get','height'], 'fill-extrusion-base': ['get','min_height'], 'fill-extrusion-opacity': 0.85 }
          })
          // Add POI markers
          pois.forEach(poi => {
            const el = document.createElement('div')
            const poiColor = POI_COLORS[poi.type] || color
            el.style.cssText = `width:10px;height:10px;background:${poiColor};border-radius:50%;border:2px solid white;box-shadow:0 0 8px ${poiColor}88;cursor:pointer;`
            el.addEventListener('click', () => onPoiClick(poi))
            new mapboxgl.Marker(el).setLngLat([poi.lng, poi.lat]).addTo(map)
          })
          // Center marker
          const center = document.createElement('div')
          center.style.cssText = `width:16px;height:16px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 0 20px ${color}88;`
          new mapboxgl.Marker(center).setLngLat([city.lng, city.lat]).addTo(map)
        })
      } catch (e) { console.log('Mapbox init error', e) }
    }
    init()
    return () => { if (map) map.remove() }
  }, [city.id])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 240 }}>
      <div ref={ref} className="w-full h-full"/>
      {!loaded && <div className="absolute inset-0"><CityMap city={city} pois={pois} color={color} onPoiClick={onPoiClick}/></div>}
    </div>
  )
}

export default function MapView() {
  const { theme, naviMode, naviTarget, setNaviMode } = useStore()
  const t = getTheme(theme)
  const [activeCityId, setActiveCityId] = useState('ibaraki')
  const [selectedPoi, setSelectedPoi] = useState(null)

  const city = CITIES.find(c => c.id === activeCityId) || CITIES[0]
  const pois = CITY_POIS[activeCityId] || []

  const hasMapbox = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.startsWith('pk.')

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {naviMode && <NaviOverlay target={naviTarget} onClose={() => setNaviMode(false)}/>}
      </AnimatePresence>

      {/* City selector */}
      <div className="flex gap-2 px-4 mb-3 overflow-x-auto hide-scroll">
        {CITIES.map(c => {
          const active = c.id === activeCityId
          return (
            <motion.button key={c.id} whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveCityId(c.id); setSelectedPoi(null) }}
              className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl transition-all"
              style={{
                background: active ? c.color + '22' : t.surface,
                border: `1.5px solid ${active ? c.color : t.border}`,
              }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-display font-black text-white flex-shrink-0"
                style={{ background: active ? c.color : t.surfaceHigh }}>
                {c.label}
              </div>
              <div className="text-left">
                <p className="font-display font-bold text-xs leading-none" style={{ color: active ? c.color : t.text }}>{c.name}</p>
                <p className="text-[9px] mt-0.5" style={{ color: t.textFaint }}>{c.nights}N</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Map */}
      <div className="px-4 mb-3">
        <AnimatePresence mode="wait">
          <motion.div key={activeCityId} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {hasMapbox
              ? <MapboxMap city={city} pois={pois} color={city.color} onPoiClick={setSelectedPoi}/>
              : <CityMap city={city} pois={pois} color={city.color} onPoiClick={setSelectedPoi}/>
            }
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selected POI card */}
      <AnimatePresence>
        {selectedPoi && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="mx-4 mb-3 p-4 rounded-3xl flex items-center gap-3"
            style={{ background: t.surface, border: `1px solid ${t.border}` }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: (POI_COLORS[selectedPoi.type] || city.color) + '22', border: `1px solid ${(POI_COLORS[selectedPoi.type] || city.color)}44` }}>
              <POIIcon type={selectedPoi.type} size={20}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm leading-tight" style={{ color: t.text }}>{selectedPoi.name}</p>
              <span className="text-[10px] font-display font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: (POI_COLORS[selectedPoi.type] || city.color) + '22', color: POI_COLORS[selectedPoi.type] || city.color }}>
                {POI_TYPE_LABELS[selectedPoi.type] || selectedPoi.type}
              </span>
            </div>
            <button onClick={() => setNaviMode(true, { name: selectedPoi.name, address: `${city.name}, Japan` })}
              className="px-3.5 py-2 rounded-xl font-display font-bold text-xs text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${city.color}, ${city.color}cc)` }}>
              Navigate
            </button>
            <button onClick={() => setSelectedPoi(null)} className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: t.surface, border: `1px solid ${t.border}` }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POI legend + list */}
      <div className="px-4 flex-1 overflow-y-auto hide-scroll pb-2">
        <p className="text-xs font-display font-bold mb-2" style={{ color: t.textMuted }}>
          {pois.length} POINTS OF INTEREST · {city.name.toUpperCase()}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {pois.map((poi, i) => {
            const poiColor = POI_COLORS[poi.type] || city.color
            return (
              <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedPoi(poi)}
                className="flex items-center gap-2.5 p-3 rounded-2xl text-left"
                style={{ background: selectedPoi?.name === poi.name ? poiColor + '18' : t.surface, border: `1px solid ${selectedPoi?.name === poi.name ? poiColor + '44' : t.border}` }}>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: poiColor + '22', border: `1px solid ${poiColor}33` }}>
                  <POIIcon type={poi.type} size={14}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-display font-bold leading-tight truncate" style={{ color: t.text }}>{poi.name}</p>
                  <p className="text-[9px] mt-0.5" style={{ color: t.textFaint }}>{POI_TYPE_LABELS[poi.type]}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
