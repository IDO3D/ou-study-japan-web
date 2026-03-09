// components/MapView.jsx — Enhanced with Navigation Mode (Mapbox Directions)
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'

const CITIES = [
  { id: 'ibaraki', name: 'Ibaraki City', subtitle: 'Osaka Prefecture', lat: 34.8154, lng: 135.5686, zoom: 13, emoji: '🏫', color: '#E02424', nights: 10, desc: 'OIC Seminar House · Ritsumeikan University' },
  { id: 'kyoto', name: 'Kyoto', subtitle: 'Kyoto Prefecture', lat: 35.0116, lng: 135.7681, zoom: 13, emoji: '⛩️', color: '#4F46E5', nights: 11, desc: 'Historic temples, tea ceremonies & orientation tours' },
  { id: 'tokyo', name: 'Tokyo', subtitle: 'Tokyo Metropolis', lat: 35.6762, lng: 139.6503, zoom: 12, emoji: '🗼', color: '#10B981', nights: 3, desc: 'Shibuya, Shinjuku, business site visits & final tours' },
]

const CITY_POIS = {
  ibaraki: [
    { name: 'OIC Seminar House', type: 'housing', lat: 34.8154, lng: 135.5686, icon: '🏠' },
    { name: 'Ibaraki-shi Station', type: 'transit', lat: 34.8147, lng: 135.5721, icon: '🚉' },
    { name: 'AEON Mall Ibaraki', type: 'food', lat: 34.8082, lng: 135.5737, icon: '🛒' },
    { name: 'Ritsumeikan OIC Campus', type: 'edu', lat: 34.8160, lng: 135.5692, icon: '🎓' },
    { name: 'Ibaraki City Hall', type: 'landmark', lat: 34.8156, lng: 135.5685, icon: '🏛️' },
    { name: 'Lawson Convenience Store', type: 'food', lat: 34.8149, lng: 135.5710, icon: '🏪' },
  ],
  kyoto: [
    { name: 'Kinkaku-ji (Golden Pavilion)', type: 'culture', lat: 35.0394, lng: 135.7292, icon: '🏯' },
    { name: 'Fushimi Inari Shrine', type: 'culture', lat: 34.9671, lng: 135.7727, icon: '⛩️' },
    { name: 'Nishiki Market', type: 'food', lat: 35.0050, lng: 135.7650, icon: '🍜' },
    { name: 'Kyoto Station', type: 'transit', lat: 34.9858, lng: 135.7588, icon: '🚉' },
    { name: 'Gion District', type: 'culture', lat: 35.0036, lng: 135.7780, icon: '🏮' },
    { name: "Philosopher's Path", type: 'culture', lat: 35.0271, lng: 135.7944, icon: '🌸' },
    { name: 'Arashiyama Bamboo Grove', type: 'landmark', lat: 35.0170, lng: 135.6727, icon: '🎋' },
  ],
  tokyo: [
    { name: 'Shibuya Crossing', type: 'landmark', lat: 35.6595, lng: 139.7004, icon: '🚦' },
    { name: 'Senso-ji Temple', type: 'culture', lat: 35.7147, lng: 139.7966, icon: '⛩️' },
    { name: 'Shinjuku Station', type: 'transit', lat: 35.6900, lng: 139.7006, icon: '🚉' },
    { name: 'Tokyo Tower', type: 'landmark', lat: 35.6586, lng: 139.7454, icon: '🗼' },
    { name: 'Tsukiji Outer Market', type: 'food', lat: 35.6654, lng: 139.7706, icon: '🐟' },
    { name: 'Harajuku / Takeshita', type: 'culture', lat: 35.6702, lng: 139.7027, icon: '🎀' },
    { name: 'TeamLab Borderless', type: 'landmark', lat: 35.6255, lng: 139.7857, icon: '🌊' },
  ],
}

const POI_COLORS = { housing: '#E02424', transit: '#4F46E5', food: '#10B981', culture: '#FFB7C5', landmark: '#FCD34D', edu: '#60A5FA' }

const NAV_MODES = [
  { id: 'walking', icon: '🚶', label: 'Walk', profile: 'mapbox/walking', color: '#10B981' },
  { id: 'transit', icon: '🚇', label: 'Transit', profile: 'mapbox/driving', color: '#4F46E5' },
  { id: 'cycling', icon: '🚲', label: 'Bike', profile: 'mapbox/cycling', color: '#F59E0B' },
  { id: 'driving', icon: '🚗', label: 'Drive', profile: 'mapbox/driving', color: '#60A5FA' },
  { id: 'taxi', icon: '🚕', label: 'Taxi', profile: 'mapbox/driving', color: '#FBBF24' },
]

export default function MapView() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activeCity, setActiveCity] = useState('ibaraki')
  const [filter, setFilter] = useState('all')
  const [selectedPoi, setSelectedPoi] = useState(null)
  const [navMode, setNavMode] = useState(null) // null = explore, else navigation
  const [navTransport, setNavTransport] = useState('walking')
  const [destination, setDestination] = useState(null)
  const [route, setRoute] = useState(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const { userLocation } = useStore()

  const city = CITIES.find(c => c.id === activeCity)
  const pois = CITY_POIS[activeCity] || []
  const filteredPois = filter === 'all' ? pois : pois.filter(p => p.type === filter)

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const hasMapbox = MAPBOX_TOKEN?.startsWith('pk.')

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !hasMapbox) return
    if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null }

    const initMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default
        await import('mapbox-gl/dist/mapbox-gl.css')
        mapboxgl.accessToken = MAPBOX_TOKEN

        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [city.lng, city.lat],
          zoom: city.zoom,
          pitch: 40,
          bearing: 0,
        })

        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
        map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }), 'top-right')

        map.on('load', () => {
          setMapLoaded(true)
          mapInstance.current = map
          // Add 3D buildings
          map.addLayer({ id: '3d-buildings', source: 'composite', 'source-layer': 'building', filter: ['==', 'extrude', 'true'], type: 'fill-extrusion', minzoom: 14, paint: { 'fill-extrusion-color': '#1a1a2e', 'fill-extrusion-height': ['get', 'height'], 'fill-extrusion-base': ['get', 'min_height'], 'fill-extrusion-opacity': 0.7 } })

          pois.forEach(poi => {
            const el = document.createElement('div')
            el.innerHTML = `<div style="background:${POI_COLORS[poi.type] || '#E02424'};border:2.5px solid white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.5);">${poi.icon}</div>`
            new mapboxgl.Marker(el).setLngLat([poi.lng, poi.lat])
              .setPopup(new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(
                `<div style="font-family:'DM Sans',sans-serif;padding:8px;"><p style="font-weight:700;font-size:13px;margin:0 0 3px;">${poi.icon} ${poi.name}</p><p style="color:${POI_COLORS[poi.type]};font-size:11px;margin:0;text-transform:capitalize;">${poi.type}</p></div>`
              )).addTo(map)
          })
        })
      } catch (err) { console.error('Map error:', err) }
    }
    initMap()
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null } }
  }, [activeCity])

  // Get directions
  const getDirections = useCallback(async (dest) => {
    if (!userLocation || !MAPBOX_TOKEN) return
    setRouteLoading(true)
    setRoute(null)

    const mode = NAV_MODES.find(m => m.id === navTransport)
    const profile = mode?.profile || 'mapbox/walking'
    const origin = `${userLocation.lng},${userLocation.lat}`
    const destCoord = `${dest.lng},${dest.lat}`

    try {
      const res = await fetch(
        `https://api.mapbox.com/directions/v5/${profile}/${origin};${destCoord}?geometries=geojson&steps=true&access_token=${MAPBOX_TOKEN}`
      )
      const data = await res.json()
      if (data.routes?.[0]) {
        const r = data.routes[0]
        setRoute({
          distance: (r.distance / 1000).toFixed(1),
          duration: Math.ceil(r.duration / 60),
          steps: r.legs[0]?.steps?.slice(0, 5).map(s => s.maneuver?.instruction) || [],
        })

        // Draw route on map
        const map = mapInstance.current
        if (map) {
          if (map.getSource('route')) {
            map.getSource('route').setData({ type: 'Feature', geometry: r.geometry })
          } else {
            map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: r.geometry } })
            map.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': mode?.color || '#4F46E5', 'line-width': 5, 'line-opacity': 0.9 } })
          }

          // Fit map to route
          const coords = r.geometry.coordinates
          const bounds = coords.reduce((b, c) => b.extend(c), new (await import('mapbox-gl')).default.LngLatBounds(coords[0], coords[0]))
          map.fitBounds(bounds, { padding: 60, duration: 1000 })
        }
      }
    } catch (err) { console.error('Directions error:', err) }
    setRouteLoading(false)
  }, [userLocation, navTransport, MAPBOX_TOKEN])

  const handlePoiNavigate = (poi) => {
    setDestination(poi)
    setNavMode('navigate')
    getDirections(poi)
    if (mapInstance.current) {
      mapInstance.current.flyTo({ center: [poi.lng, poi.lat], zoom: 15, duration: 800 })
    }
  }

  const filterTypes = ['all', ...new Set(pois.map(p => p.type))]

  return (
    <div className="px-5 pb-6 space-y-4">

      {/* City Selector */}
      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          Program Cities — 24 Nights
        </p>
        <div className="grid grid-cols-3 gap-2">
          {CITIES.map(c => (
            <button key={c.id} onClick={() => { setActiveCity(c.id); setSelectedPoi(null); setFilter('all'); setNavMode(null); setRoute(null) }}
              className="p-3 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-95"
              style={{ background: activeCity === c.id ? c.color : 'rgba(255,255,255,0.06)', border: `1px solid ${activeCity === c.id ? c.color : 'rgba(255,255,255,0.08)'}`, boxShadow: activeCity === c.id ? `0 4px 16px ${c.color}50` : 'none' }}>
              <span className="text-xl">{c.emoji}</span>
              <p className="text-[10px] font-display font-bold text-white leading-tight text-center">{c.name}</p>
              <p className="text-[9px]" style={{ color: activeCity === c.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>{c.nights}n</p>
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <motion.div key={`map-${activeCity}`} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        {hasMapbox ? (
          <div className="relative rounded-3xl overflow-hidden" style={{ height: '260px' }}>
            <div ref={mapRef} className="w-full h-full" />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full rounded-3xl flex items-center justify-center text-white font-display font-bold" style={{ height: 200, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
            {city.emoji} {city.name}
          </div>
        )}
      </motion.div>

      {/* Navigation Mode Panel */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="font-display font-black text-white text-sm">🧭 Navigation</p>
          {navMode && (
            <button onClick={() => { setNavMode(null); setRoute(null); setDestination(null) }}
              className="text-xs font-display font-bold px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,100,100,0.15)', color: '#FF6B6B' }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Transport mode selector */}
        <div className="flex gap-1 p-2">
          {NAV_MODES.map(m => (
            <button key={m.id} onClick={() => { setNavTransport(m.id); if (destination) getDirections(destination) }}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all"
              style={{ background: navTransport === m.id ? m.color + '20' : 'transparent', border: navTransport === m.id ? `1px solid ${m.color}` : '1px solid transparent' }}>
              <span className="text-base">{m.icon}</span>
              <span className="text-[9px] font-display font-bold" style={{ color: navTransport === m.id ? m.color : 'rgba(255,255,255,0.4)' }}>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Route result */}
        <AnimatePresence>
          {routeLoading && (
            <div className="px-4 pb-3 flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
              Calculating route...
            </div>
          )}
          {route && !routeLoading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="px-4 pb-4 space-y-2">
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'var(--brand-subtle)' }}>
                  <p className="font-display font-black text-white text-lg">{route.duration}</p>
                  <p className="text-[9px] font-display uppercase" style={{ color: 'var(--text-muted)' }}>min</p>
                </div>
                <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="font-display font-black text-white text-lg">{route.distance}</p>
                  <p className="text-[9px] font-display uppercase" style={{ color: 'var(--text-muted)' }}>km</p>
                </div>
                <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-lg">{NAV_MODES.find(m => m.id === navTransport)?.icon}</p>
                  <p className="text-[9px] font-display uppercase" style={{ color: 'var(--text-muted)' }}>{navTransport}</p>
                </div>
              </div>
              {route.steps.length > 0 && (
                <div className="space-y-1">
                  {route.steps.map((step, i) => (
                    <div key={i} className="flex gap-2 text-xs py-1" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="font-display font-black" style={{ color: 'var(--brand-light)', minWidth: 16 }}>{i + 1}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          {!route && !routeLoading && !destination && (
            <div className="px-4 pb-3">
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Tap a place below to get directions
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* POI Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scroll">
        {filterTypes.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-display font-bold transition-all active:scale-95"
            style={{ background: filter === f ? 'var(--brand)' : 'rgba(255,255,255,0.07)', color: filter === f ? 'white' : 'rgba(255,255,255,0.4)', border: filter === f ? '1px solid var(--brand)' : '1px solid rgba(255,255,255,0.08)' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* POI Cards */}
      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          {filteredPois.length} Places in {city.name}
        </p>
        <div className="space-y-2">
          {filteredPois.map((poi, i) => {
            const isSelected = selectedPoi?.name === poi.name
            return (
              <motion.div key={poi.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedPoi(isSelected ? null : poi)}
                className="flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-all"
                style={{ background: isSelected ? `${POI_COLORS[poi.type]}15` : 'var(--surface)', border: `1px solid ${isSelected ? POI_COLORS[poi.type] + '45' : 'var(--border)'}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${POI_COLORS[poi.type]}20` }}>
                  {poi.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-white text-sm truncate">{poi.name}</p>
                  <p className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>{poi.type}</p>
                </div>
                {isSelected && (
                  <button onClick={(e) => { e.stopPropagation(); handlePoiNavigate(poi) }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-display font-bold text-white transition-all"
                    style={{ background: 'var(--brand)', boxShadow: '0 4px 12px var(--brand-glow)' }}>
                    Navigate →
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Journey strip */}
      <div className="p-4 rounded-2xl" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Full Itinerary</p>
        {CITIES.map(c => (
          <div key={c.id} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-xl">{c.emoji}</span>
            <div className="flex-1">
              <p className="font-display font-semibold text-white text-xs">{c.name}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.subtitle}</p>
            </div>
            <span className="font-display font-bold text-xs" style={{ color: c.color }}>{c.nights} nights</span>
          </div>
        ))}
        <div className="flex justify-between pt-2.5">
          <span className="font-display font-bold text-white text-sm">Total</span>
          <span className="font-display font-black text-sm" style={{ color: 'var(--brand-light)' }}>24 Nights</span>
        </div>
      </div>
    </div>
  )
}
