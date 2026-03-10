// components/MapView.jsx — Apple Maps-style full-screen experience
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

// ─── Japan POIs ──────────────────────────────────────────────
const JAPAN_POIS = [
  // Ibaraki / Osaka
  { id: 'oic', name: 'OIC Seminar House', cat: 'housing', lat: 34.8154, lng: 135.5686, icon: '🏠', city: 'Ibaraki' },
  { id: 'ibaraki-st', name: 'Ibaraki-shi Station', cat: 'transit', lat: 34.8147, lng: 135.5721, icon: '🚉', city: 'Ibaraki' },
  { id: 'aeon', name: 'AEON Mall Ibaraki', cat: 'shopping', lat: 34.8082, lng: 135.5737, icon: '🛒', city: 'Ibaraki' },
  { id: 'rits', name: 'Ritsumeikan OIC Campus', cat: 'edu', lat: 34.8160, lng: 135.5692, icon: '🎓', city: 'Ibaraki' },
  // Kyoto
  { id: 'kinkaku', name: 'Kinkaku-ji', cat: 'culture', lat: 35.0394, lng: 135.7292, icon: '🏯', city: 'Kyoto' },
  { id: 'fushimi', name: 'Fushimi Inari Shrine', cat: 'culture', lat: 34.9671, lng: 135.7727, icon: '⛩️', city: 'Kyoto' },
  { id: 'nishiki', name: 'Nishiki Market', cat: 'food', lat: 35.0050, lng: 135.7650, icon: '🍜', city: 'Kyoto' },
  { id: 'kyoto-st', name: 'Kyoto Station', cat: 'transit', lat: 34.9858, lng: 135.7588, icon: '🚉', city: 'Kyoto' },
  { id: 'gion', name: 'Gion District', cat: 'culture', lat: 35.0036, lng: 135.7780, icon: '🏮', city: 'Kyoto' },
  { id: 'arashiyama', name: 'Arashiyama Bamboo Grove', cat: 'nature', lat: 35.0170, lng: 135.6727, icon: '🎋', city: 'Kyoto' },
  // Tokyo
  { id: 'shibuya', name: 'Shibuya Crossing', cat: 'landmark', lat: 35.6595, lng: 139.7004, icon: '🚦', city: 'Tokyo' },
  { id: 'sensoji', name: 'Senso-ji Temple', cat: 'culture', lat: 35.7147, lng: 139.7966, icon: '⛩️', city: 'Tokyo' },
  { id: 'shinjuku', name: 'Shinjuku Station', cat: 'transit', lat: 35.6900, lng: 139.7006, icon: '🚉', city: 'Tokyo' },
  { id: 'tokyo-twr', name: 'Tokyo Tower', cat: 'landmark', lat: 35.6586, lng: 139.7454, icon: '🗼', city: 'Tokyo' },
  { id: 'tsukiji', name: 'Tsukiji Outer Market', cat: 'food', lat: 35.6654, lng: 139.7706, icon: '🐟', city: 'Tokyo' },
  { id: 'harajuku', name: 'Harajuku / Takeshita St', cat: 'culture', lat: 35.6702, lng: 139.7027, icon: '🎀', city: 'Tokyo' },
  { id: 'teamlab', name: 'teamLab Borderless', cat: 'landmark', lat: 35.6255, lng: 139.7857, icon: '🌊', city: 'Tokyo' },
]

const CAT_COLORS = {
  housing: '#E02424', transit: '#4F46E5', food: '#10B981',
  culture: '#FFB7C5', landmark: '#FCD34D', edu: '#60A5FA',
  shopping: '#F97316', nature: '#22c55e',
}

const CATS = [
  { id: 'all', label: 'All', emoji: '🗾' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'culture', label: 'Culture', emoji: '⛩️' },
  { id: 'transit', label: 'Transit', emoji: '🚉' },
  { id: 'landmark', label: 'Sights', emoji: '🗼' },
  { id: 'housing', label: 'Housing', emoji: '🏠' },
  { id: 'nature', label: 'Nature', emoji: '🌸' },
]

const NAV_MODES = [
  { id: 'walking', label: 'Walk', icon: '🚶', profile: 'mapbox/walking', color: '#10B981' },
  { id: 'transit', label: 'Transit', icon: '🚇', profile: 'mapbox/driving', color: '#4F46E5' },
  { id: 'cycling', label: 'Bike', icon: '🚲', profile: 'mapbox/cycling', color: '#F59E0B' },
  { id: 'driving', label: 'Drive', icon: '🚗', profile: 'mapbox/driving', color: '#60A5FA' },
]

const CITY_CENTERS = {
  Ibaraki: { lat: 34.8154, lng: 135.5686, zoom: 14 },
  Kyoto: { lat: 35.0116, lng: 135.7681, zoom: 13 },
  Tokyo: { lat: 35.6762, lng: 139.6503, zoom: 12 },
}

export default function MapView() {
  const mapRef = useRef(null)
  const mapboxglRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const searchTimeoutRef = useRef(null)
  const navModeRef = useRef('walking') // always-fresh ref to avoid stale closure

  const [mapReady, setMapReady] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedPoi, setSelectedPoi] = useState(null)
  const [activeCity, setActiveCity] = useState('Kyoto')
  const [activeCat, setActiveCat] = useState('all')
  const [navMode, setNavMode] = useState('walking')
  const [route, setRoute] = useState(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState(null)
  const [bottomSheet, setBottomSheet] = useState('peek')
  const [showSearch, setShowSearch] = useState(false)

  const { userLocation, navDestination, clearNavDestination } = useStore()

  // Keep ref in sync with state
  useEffect(() => { navModeRef.current = navMode }, [navMode])

  const filteredPois = JAPAN_POIS.filter(p =>
    activeCat === 'all' || p.cat === activeCat
  )

  // ── Init Mapbox ──────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !MAPBOX_TOKEN?.startsWith('pk.')) return

    const init = async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      await import('mapbox-gl/dist/mapbox-gl.css')
      mapboxglRef.current = mapboxgl
      mapboxgl.accessToken = MAPBOX_TOKEN

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [135.7681, 35.0116],
        zoom: 13,
        pitch: 45,
        bearing: -10,
        antialias: true,
      })

      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeadingIndicator: true,
      }), 'top-right')

      map.on('load', () => {
        mapInstance.current = map
        setMapReady(true)

        // 3D buildings
        map.addLayer({
          id: '3d-buildings', source: 'composite', 'source-layer': 'building',
          filter: ['==', 'extrude', 'true'], type: 'fill-extrusion', minzoom: 14,
          paint: {
            'fill-extrusion-color': '#1a1a2e',
            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'height']],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.75,
          }
        })
      })

      // Close search on map click
      map.on('click', () => { setShowSearch(false); setSuggestions([]) })
    }
    init()
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null } }
  }, [])

  // ── Render POI markers when map ready ───────────────────────
  useEffect(() => {
    if (!mapReady || !mapboxglRef.current || !mapInstance.current) return
    const map = mapInstance.current
    const mapboxgl = mapboxglRef.current

    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    filteredPois.forEach(poi => {
      const el = document.createElement('div')
      const color = CAT_COLORS[poi.cat] || '#E02424'
      el.innerHTML = `
        <div style="
          background:${color};border:2.5px solid rgba(255,255,255,0.9);
          border-radius:50%;width:34px;height:34px;
          display:flex;align-items:center;justify-content:center;
          font-size:16px;cursor:pointer;
          box-shadow:0 4px 14px rgba(0,0,0,0.5),0 0 0 4px ${color}30;
          transition:transform 0.15s;
        ">${poi.icon}</div>`
      el.style.cursor = 'pointer'
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        setSelectedPoi(poi)
        setBottomSheet('partial')
        map.flyTo({ center: [poi.lng, poi.lat], zoom: 15.5, pitch: 50, bearing: 10, duration: 900, essential: true })
      })

      const marker = new mapboxgl.Marker(el).setLngLat([poi.lng, poi.lat]).addTo(map)
      markersRef.current.push(marker)
    })
  }, [mapReady, activeCat])

  // ── Search autocomplete (Mapbox Geocoding) ──────────────────
  const handleSearchInput = (val) => {
    setQuery(val)
    clearTimeout(searchTimeoutRef.current)
    if (!val.trim() || val.length < 2) { setSuggestions([]); return }

    // Local POI match first
    const localMatches = JAPAN_POIS.filter(p =>
      p.name.toLowerCase().includes(val.toLowerCase()) ||
      p.city.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 4).map(p => ({ type: 'poi', ...p }))

    setSuggestions(localMatches)

    // Mapbox geocoding for extra results
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const center = mapInstance.current?.getCenter()
        const prox = center ? `${center.lng},${center.lat}` : '135.7681,35.0116'
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?proximity=${prox}&country=jp&language=en&limit=4&access_token=${MAPBOX_TOKEN}`
        const res = await fetch(url)
        const data = await res.json()
        const geocoded = (data.features || []).map(f => ({
          type: 'geocode',
          id: f.id,
          name: f.text,
          desc: f.place_name,
          lat: f.center[1],
          lng: f.center[0],
          icon: '📍',
          cat: 'search',
        }))
        setSuggestions(prev => {
          const ids = prev.map(p => p.id)
          return [...prev, ...geocoded.filter(g => !ids.includes(g.id))].slice(0, 8)
        })
      } catch { }
    }, 320)
  }

  const handleSuggestionSelect = (s) => {
    setQuery(s.name)
    setSuggestions([])
    setShowSearch(false)
    setSelectedPoi(s)
    setBottomSheet('partial')
    mapInstance.current?.flyTo({ center: [s.lng, s.lat], zoom: 15.5, pitch: 50, bearing: 10, duration: 900, essential: true })
  }

  // ── City jump ────────────────────────────────────────────────
  const jumpToCity = (city) => {
    setActiveCity(city)
    const c = CITY_CENTERS[city]
    mapInstance.current?.flyTo({ center: [c.lng, c.lat], zoom: c.zoom, pitch: 40, bearing: -5, duration: 1200 })
  }

  // ── Helpers: safely manage route layers ────────────────────
  const clearRouteLayer = () => {
    const map = mapInstance.current
    if (!map) return
    try { if (map.getLayer('route-glow')) map.removeLayer('route-glow') } catch { }
    try { if (map.getLayer('route-line')) map.removeLayer('route-line') } catch { }
    try { if (map.getSource('route')) map.removeSource('route') } catch { }
  }

  const drawRouteOnMap = (geometry, color) => {
    const map = mapInstance.current
    const mapboxgl = mapboxglRef.current
    if (!map || !mapboxgl) return
    clearRouteLayer()
    map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry } })
    map.addLayer({ id: 'route-glow', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': color, 'line-width': 16, 'line-opacity': 0.15, 'line-blur': 10 } })
    map.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': color, 'line-width': 5, 'line-opacity': 0.97 } })
    const coords = geometry.coordinates
    const bounds = coords.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(coords[0], coords[0]))
    map.fitBounds(bounds, { padding: { top: 160, bottom: 280, left: 40, right: 40 }, duration: 1200 })
  }

  // ── Directions ───────────────────────────────────────────────
  const getDirections = useCallback(async (dest) => {
    if (!MAPBOX_TOKEN?.startsWith('pk.')) {
      setRouteError('Mapbox token not configured.')
      return
    }
    setRouteLoading(true)
    setRoute(null)
    setRouteError(null)

    // Use GPS if available, otherwise fall back to current map center
    const currentMode = NAV_MODES.find(m => m.id === navModeRef.current) || NAV_MODES[0]
    let originLng, originLat
    if (userLocation?.lat && userLocation?.lng) {
      originLng = userLocation.lng
      originLat = userLocation.lat
    } else {
      // Fallback: use current map center (wherever user is viewing)
      const center = mapInstance.current?.getCenter()
      originLng = center?.lng ?? 135.7681
      originLat = center?.lat ?? 35.0116
    }

    const origin = `${originLng},${originLat}`
    const end = `${dest.lng},${dest.lat}`
    const url = `https://api.mapbox.com/directions/v5/${currentMode.profile}/${origin};${end}?geometries=geojson&steps=true&language=en&access_token=${MAPBOX_TOKEN}`

    try {
      const res = await fetch(url)
      const data = await res.json()

      if (data.code && data.code !== 'Ok') {
        throw new Error(data.message || `Directions error: ${data.code}`)
      }

      const r = data.routes?.[0]
      if (!r) throw new Error('No route found between these points.')

      setRoute({
        distance: (r.distance / 1000).toFixed(1),
        duration: Math.ceil(r.duration / 60),
        steps: r.legs[0]?.steps?.slice(0, 6).map(s => s.maneuver?.instruction).filter(Boolean) || [],
        color: currentMode.color,
        mode: currentMode.label,
        usedGPS: !!(userLocation?.lat),
      })
      drawRouteOnMap(r.geometry, currentMode.color)
    } catch (err) {
      console.error('Directions failed:', err)
      setRouteError(err.message || 'Could not load directions. Check your connection.')
    }
    setRouteLoading(false)
  }, [userLocation]) // navMode read from ref — always fresh

  // ── Handle external navDestination ──────────────────────────
  useEffect(() => {
    if (navDestination && mapReady) {
      const dest = navDestination
      clearNavDestination()
      setSelectedPoi(dest)
      setBottomSheet('partial')
      mapInstance.current?.flyTo({ center: [dest.lng, dest.lat], zoom: 15.5, pitch: 50, duration: 900 })
      setTimeout(() => getDirections(dest), 500)
    }
  }, [navDestination, mapReady])

  // ─── Bottom sheet snap height ─────────────────────────────
  const SHEET_HEIGHTS = { hidden: 0, peek: 90, partial: 340, full: '85%' }

  return (
    // Full-screen overlay — covers entire app shell viewport
    <div style={{ position: 'absolute', inset: 0, zIndex: 5, overflow: 'hidden', background: '#0a0a0f' }}>

      {/* ── MAP CANVAS ────────────────────────────────────────── */}
      <div ref={mapRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Loading splash */}
      {!mapReady && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#841617', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(132,22,23,0.6)', fontSize: 28 }}>⛩️</div>
          <div style={{ width: 40, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '60%', background: '#CC2124', animation: 'pulse 1.2s ease-in-out infinite' }} />
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.1em' }}>LOADING MAP</p>
        </div>
      )}

      {/* ── RETURN TO DASHBOARD HUD (Snapchat Style) ─────────────────────────── */}
      <button
        onClick={() => { if (typeof window !== 'undefined' && window.__ouNav) window.__ouNav('home') }}
        style={{
          position: 'absolute', top: 'max(16px, calc(env(safe-area-inset-top) + 12px))', left: 12, zIndex: 50,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)',
          width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', color: 'white', fontSize: 18, paddingRight: 2
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>

      {/* ── SEARCH BAR (floating top) ─────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 'max(64px, calc(env(safe-area-inset-top) + 64px))',
        left: 12, right: 12,
        zIndex: 20,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {/* Search input */}
        <motion.div
          initial={false}
          animate={{ scale: showSearch ? 1.01 : 1 }}
          style={{
            background: 'rgba(18,18,22,0.92)',
            backdropFilter: 'blur(28px) saturate(200%)',
            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            border: `1px solid ${showSearch ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingInline: 14, paddingBlock: 12 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>🔍</span>
            <input
              value={query}
              onChange={e => handleSearchInput(e.target.value)}
              onFocus={() => setShowSearch(true)}
              placeholder="Search places in Japan..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'white', fontSize: 15, fontFamily: 'Inter, sans-serif',
              }}
            />
            {query && (
              <button onClick={() => { setQuery(''); setSuggestions([]); setShowSearch(false) }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, padding: 2 }}>✕</button>
            )}
          </div>

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}
              >
                {suggestions.map((s, i) => (
                  <button key={s.id || i} onClick={() => handleSuggestionSelect(s)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 16px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: s.cat ? `${CAT_COLORS[s.cat] || '#555'}20` : 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>{s.icon || '📍'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Syne, sans-serif', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.city || s.desc || 'Japan'}
                      </p>
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>→</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Category chips */}
        {!showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATS.map(c => (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 13px',
                  background: activeCat === c.id ? 'var(--brand, #CC2124)' : 'rgba(18,18,22,0.88)',
                  border: `1px solid ${activeCat === c.id ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: 99, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 12 }}>{c.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: activeCat === c.id ? 'white' : 'rgba(255,255,255,0.7)', fontFamily: 'Syne, sans-serif' }}>{c.label}</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* City jumper */}
        {!showSearch && (
          <div style={{ display: 'flex', gap: 7 }}>
            {Object.keys(CITY_CENTERS).map(city => (
              <button key={city} onClick={() => jumpToCity(city)}
                style={{
                  flex: 1, padding: '7px 4px', borderRadius: 12, cursor: 'pointer', border: 'none',
                  background: activeCity === city ? 'rgba(204,33,36,0.85)' : 'rgba(18,18,22,0.82)',
                  backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                  color: activeCity === city ? 'white' : 'rgba(255,255,255,0.55)',
                  fontSize: 11, fontWeight: 700, fontFamily: 'Syne, sans-serif',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  transition: 'all 0.15s',
                }}
              >{city}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM SHEET ─────────────────────────────────────── */}
      <motion.div
        animate={{ height: typeof SHEET_HEIGHTS[bottomSheet] === 'number' ? SHEET_HEIGHTS[bottomSheet] : SHEET_HEIGHTS[bottomSheet] }}
        transition={{ type: 'spring', stiffness: 340, damping: 36 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 15,
          background: 'rgba(12,12,16,0.97)',
          backdropFilter: 'blur(30px) saturate(200%)',
          WebkitBackdropFilter: 'blur(30px) saturate(200%)',
          borderRadius: '24px 24px 0 0',
          border: '1px solid rgba(255,255,255,0.07)',
          borderBottom: 'none',
          overflow: 'hidden',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4, cursor: 'pointer' }}
          onClick={() => setBottomSheet(s => s === 'peek' ? 'partial' : s === 'partial' ? 'full' : 'peek')}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.18)' }} />
        </div>

        {selectedPoi ? (
          <div style={{ paddingInline: 16, paddingTop: 4, height: '100%', overflowY: 'auto' }}>
            {/* POI header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: `${CAT_COLORS[selectedPoi.cat] || '#E02424'}20`,
                border: `2px solid ${CAT_COLORS[selectedPoi.cat] || '#E02424'}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
              }}>{selectedPoi.icon || '📍'}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{selectedPoi.name}</h2>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}>
                  {selectedPoi.cat || 'Place'} · {selectedPoi.city || 'Japan'}
                </p>
              </div>
              <button onClick={() => { setSelectedPoi(null); setBottomSheet('peek'); setRoute(null) }}
                style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', flexShrink: 0, fontSize: 13 }}>✕</button>
            </div>

            {/* Transport mode selector */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {NAV_MODES.map(m => (
                <button key={m.id} onClick={() => { setNavMode(m.id); if (selectedPoi) setTimeout(() => getDirections(selectedPoi), 50) }}
                  style={{
                    flex: 1, padding: '8px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: navMode === m.id ? `${m.color}25` : 'rgba(255,255,255,0.06)',
                    outline: navMode === m.id ? `1px solid ${m.color}` : 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                    transition: 'all 0.15s',
                  }}>
                  <span style={{ fontSize: 18 }}>{m.icon}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: navMode === m.id ? m.color : 'rgba(255,255,255,0.4)', fontFamily: 'Syne, sans-serif' }}>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Route Error message */}
            {routeError && (
              <div style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(224,36,36,0.15)', border: '1px solid rgba(224,36,36,0.3)', marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#fca5a5', fontFamily: 'Inter, sans-serif' }}>⚠️ {routeError}</p>
              </div>
            )}

            {/* Navigate CTA */}
            <button onClick={() => getDirections(selectedPoi)}
              disabled={routeLoading}
              style={{
                width: '100%', padding: '13px', borderRadius: 16, border: 'none', cursor: 'pointer',
                background: routeLoading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #CC2124, #841617)',
                color: 'white', fontSize: 14, fontWeight: 800, fontFamily: 'Syne, sans-serif',
                boxShadow: routeLoading ? 'none' : '0 6px 20px rgba(132,22,23,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginBottom: route ? 12 : 0,
                transition: 'all 0.2s',
              }}>
              {routeLoading
                ? <><span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Calculating...</>
                : '📍 Get Directions'}
            </button>

            {/* Route result */}
            <AnimatePresence>
              {route && !routeLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {[
                      { label: 'Time', value: `${route.duration} min` },
                      { label: 'Distance', value: `${route.distance} km` },
                      { label: 'Mode', value: NAV_MODES.find(m => m.id === navMode)?.label },
                    ].map(s => (
                      <div key={s.label} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'Syne, sans-serif' }}>{s.value}</p>
                        <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {route && route.usedGPS === false && (
                    <div style={{ marginTop: 8, textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,165,0,0.8)', fontFamily: 'Inter, sans-serif' }}>
                        📍 Using map center as starting point (GPS unavailable)
                      </p>
                    </div>
                  )}

                  {route.steps.length > 0 && (
                    <div style={{ marginTop: 12, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p style={{ margin: 0, padding: '8px 14px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.04)' }}>Directions</p>
                      {route.steps.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: route.color, fontFamily: 'Syne, sans-serif', minWidth: 18 }}>{i + 1}</span>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Peek state — nearby places list */
          <div style={{ paddingInline: 16, paddingTop: 4 }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {filteredPois.length} places · {activeCity}
            </p>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
              {filteredPois.filter(p => p.city === activeCity).map(poi => (
                <button key={poi.id} onClick={() => { setSelectedPoi(poi); setBottomSheet('partial'); mapInstance.current?.flyTo({ center: [poi.lng, poi.lat], zoom: 15.5, pitch: 50, duration: 900 }) }}
                  style={{
                    flexShrink: 0, width: 150, padding: '10px 12px', borderRadius: 16, border: 'none', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.06)', textAlign: 'left',
                    display: 'flex', flexDirection: 'column', gap: 6,
                    outline: '1px solid rgba(255,255,255,0.07)',
                  }}>
                  <span style={{ fontSize: 22 }}>{poi.icon}</span>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'white', fontFamily: 'Syne, sans-serif', lineHeight: 1.3 }}>{poi.name}</p>
                  <span style={{ fontSize: 9, fontWeight: 700, color: CAT_COLORS[poi.cat] || '#fff', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}>{poi.cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  )
}
