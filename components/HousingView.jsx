// components/HousingView.jsx — v5 Airbnb-quality stay with 3D Mapbox + area info
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'
import { getTheme } from '../utils/themes'
import NaviOverlay from './NaviOverlay'

const PROPERTIES = [
  {
    id:'oic',name:'OIC Seminar House',nameJp:'OICセミナーハウス',city:'Ibaraki City, Osaka Pref.',
    nights:10,checkIn:'May 15',checkOut:'May 25',
    image:'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
    heroImg:'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200',
    lat:34.8154,lng:135.5686,
    address:'2-150 Iwakura-cho, Ibaraki, Osaka 567-8570',
    description:'Your home base for the Japan program. Located on the Ritsumeikan OIC campus — one of Japan\'s most modern university campuses. Walk to class, walk to the konbini, walk to the train.',
    amenities:['WiFi (600 Mbps)','Air conditioning','Laundry (¥200/wash)','Common kitchen','Study lounge 24/7','Mail service','Bicycle rental'],
    images:[
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    ],
    area:{
      shops:['FamilyMart (2 min walk)','7-Eleven (4 min)','AEON Mall (15 min bike)','Daiso ¥100 store (10 min)'],
      atms:['Japan Post ATM — FamilyMart (accepts foreign cards)','7-Bank ATM — 7-Eleven (Visa/MC/Amex)'],
      transit:['Ibaraki-shi Station (7 min walk)','Osaka Monorail stop (12 min)','Hankyu Bus stop (2 min)'],
      sim:['IIJmio SIM available at AEON Mall','Rakuten Mobile — nearby Yodobashi Camera'],
      food:['Saizeriya (5 min)','Yoshinoya (3 min)','Ramen Itto (8 min)','Izakaya strip (10 min walk)'],
      healthcare:['Ibaraki City Hospital (1.2km)','Koyama Pharmacy (6 min walk)','Matsumoto Kiyoshi drugstore (8 min)'],
    },
    color:'#E02424',emoji:'OIC',rating:4.6,
  },
  {
    id:'kyoto',name:'Kyoto Program Hotel',nameJp:'京都プログラムホテル',city:'Kyoto, Kyoto Prefecture',
    nights:11,checkIn:'May 25',checkOut:'Jun 5',
    image:'https://images.unsplash.com/photo-1578469645742-46cae010e5d4?auto=format&fit=crop&q=80&w=1200',
    heroImg:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=1200',
    lat:35.0116,lng:135.7681,
    address:'Higashiyama-ku, Kyoto 605-0000',
    description:'A traditional machiya-style hotel in the heart of Kyoto\'s historic Higashiyama district. Steps from Kiyomizudera and the famous stone-paved Sannenzaka slope.',
    amenities:['WiFi','Breakfast included','Yukata robe','Shared onsen bath','Luggage storage','24-hr front desk','Tea ceremony lounge'],
    images:[
      'https://images.unsplash.com/photo-1578469645742-46cae010e5d4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=800',
    ],
    area:{
      shops:['Nishiki Market (20 min walk)','Teramachi Shopping Arcade (15 min)','Kyoto Tower basement shops','Isetan department store'],
      atms:['Japan Post ATM at main post office (10 min)','7-Bank ATM at Kyoto Station (15 min)'],
      transit:['Higashiyama Station (3 min walk)','Kyoto Station (Subway 10 min)','Multiple bus stops at door'],
      sim:['Softbank shop (Kawaramachi, 20 min)','Bic Camera Kyoto Station — all carriers'],
      food:['Nishiki Market stalls (20 min)','Ramen Santouka (15 min)','Tofu kaiseki nearby','Matcha cafe 2 min'],
      healthcare:['Kyoto University Hospital (20 min)','Welcia Pharmacy (8 min)','Sundrug drugstore (5 min)'],
    },
    color:'#4F46E5',emoji:'KYO',rating:4.8,
  },
  {
    id:'tokyo',name:'Tokyo Program Hotel',nameJp:'東京プログラムホテル',city:'Shinjuku, Tokyo',
    nights:3,checkIn:'Jun 5',checkOut:'Jun 8',
    image:'https://images.unsplash.com/photo-1542051812-f4539618b14a?auto=format&fit=crop&q=80&w=1200',
    heroImg:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200',
    lat:35.6762,lng:139.6503,
    address:'3-1-1 Nishi-Shinjuku, Shinjuku, Tokyo 160-0023',
    description:'Modern hotel in the heart of Shinjuku, steps from one of the world\'s busiest train stations. Perfect base for your final days exploring Tokyo.',
    amenities:['WiFi','City view rooms','Gym access','Restaurant on 22F','Concierge','Luggage forwarding','Airport limousine bus'],
    images:[
      'https://images.unsplash.com/photo-1542051812-f4539618b14a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    ],
    area:{
      shops:['Takashimaya Times Square (3 min)','Yodobashi Camera (5 min)','Don Quijote (8 min)','Tokyu Hands (5 min)'],
      atms:['Japan Post ATM (Shinjuku Main PO, 5 min)','7-Bank in every 7-Eleven','Citibank ATM (10 min)'],
      transit:['Shinjuku Station — all lines (2 min walk)','Narita Express (N\'EX) — direct to airport','Airport limousine bus stop at hotel entrance'],
      sim:['Yodobashi Camera — all carriers + prepaid SIMs','IIJmio shop (10 min)'],
      food:['Omoide Yokocho yakitori alley (5 min)','Ramen Street in Takashimaya (3 min)','Kabukicho entertainment district','Isetan B2 food hall'],
      healthcare:['Shinjuku Mitsui Building Clinic (5 min)','Sundrug pharmacy (2 min)','Matsumoto Kiyoshi (3 min)'],
    },
    color:'#10B981',emoji:'TYO',rating:4.7,
  },
]

// Area icon component — uses small text badges, no emojis
function AreaIcon({ type, size = 14 }) {
  const colors = { shops:'#f59e0b', atms:'#818CF8', transit:'#4F46E5', sim:'#10B981', food:'#E02424', healthcare:'#ef4444' }
  const color = colors[type] || '#fff'
  const icons = {
    shops:      <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>,
    atms:       <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h2M12 15h5"/></>,
    transit:    <><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 10h16"/><circle cx="8.5" cy="16.5" r="1.2"/><circle cx="15.5" cy="16.5" r="1.2"/><path d="M8 20l-2 2M16 20l2 2"/></>,
    sim:        <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></>,
    food:       <><path d="M7 2v20M7 2C7 2 3 5 3 10h4M7 2c0 0 4 3 4 8H7"/><path d="M21 2v6a4 4 0 01-4 4v10"/></>,
    healthcare: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {icons[type] || icons.shops}
    </svg>
  )
}

const AREA_ICONS = {
  shops:'SHP', atms:'ATM', transit:'TRN', sim:'SIM', food:'EAT', healthcare:'MED'
}
const AREA_LABELS = {
  shops:'Nearby Shops', atms:'ATMs & Banking', transit:'Transit Options', sim:'SIM Cards', food:'Food & Dining', healthcare:'Pharmacy & Health'
}

function OSMStaticMap({ lat, lng, color, zoom = 15 }) {
  const tileX = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom))
  const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
  const tiles = [[tileX-1,tileY],[tileX,tileY],[tileX+1,tileY],[tileX-1,tileY+1],[tileX,tileY+1],[tileX+1,tileY+1]]

  return (
    <div className="relative w-full h-full overflow-hidden" style={{background:'#1a1a2e'}}>
      <div className="absolute inset-0 grid" style={{gridTemplateColumns:'repeat(3,33.34%)',gridTemplateRows:'repeat(2,50%)'}}>
        {tiles.map(([x,y],i)=>(
          <img key={i} src={`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`}
            className="w-full h-full object-cover" alt=""
            style={{filter:'invert(0.88) hue-rotate(190deg) saturate(0.7) brightness(0.65)'}}/>
        ))}
      </div>
      {/* Pulse marker */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="absolute rounded-full" style={{width:48,height:48,background:color+'33'}}
          animate={{scale:[1,1.8,1],opacity:[0.8,0,0.8]}} transition={{duration:2,repeat:Infinity}}/>
        <div className="relative w-5 h-5 rounded-full flex items-center justify-center"
          style={{background:color,boxShadow:`0 0 16px ${color}88`,border:'3px solid white'}}>
          <div className="w-2 h-2 rounded-full bg-white"/>
        </div>
      </div>
      <div className="absolute bottom-2 right-2">
        <span className="text-[8px]" style={{color:'rgba(255,255,255,0.3)'}}>© OpenStreetMap</span>
      </div>
    </div>
  )
}

function MapboxMap({ lat, lng, color }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  const token = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const hasToken = token && token.startsWith('pk.')

  useEffect(() => {
    if (!ref.current || !hasToken) return
    let map
    const init = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default
        mapboxgl.accessToken = token
        map = new mapboxgl.Map({
          container: ref.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [lng, lat],
          zoom: 15,
          pitch: 55,
          bearing: -15,
          antialias: true,
        })
        map.on('load', () => {
          setLoaded(true)
          mapRef.current = map
          map.addLayer({ id: '3d-buildings', source: 'composite', 'source-layer': 'building',
            filter: ['==', 'extrude', 'true'], type: 'fill-extrusion', minzoom: 14,
            paint: { 'fill-extrusion-color': '#1a1a2e', 'fill-extrusion-height': ['get','height'], 'fill-extrusion-base': ['get','min_height'], 'fill-extrusion-opacity': 0.8 }
          })
          const el = document.createElement('div')
          el.style.cssText = `width:24px;height:24px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 0 20px ${color}88;cursor:pointer;`
          new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map)
        })
      } catch (e) { console.log('Mapbox init error:', e) }
    }
    init()
    return () => { if (map) map.remove() }
  }, [lat, lng, hasToken, token, color])

  if (!hasToken) return <OSMStaticMap lat={lat} lng={lng} color={color}/>

  return (
    <div className="relative w-full h-full">
      <div ref={ref} className="w-full h-full"/>
      {!loaded && <OSMStaticMap lat={lat} lng={lng} color={color}/>}
    </div>
  )
}

function PropertyDetail({ prop, onBack }) {
  const { theme, setNaviMode, naviMode, naviTarget } = useStore()
  const t = getTheme(theme)
  const [activeSection, setActiveSection] = useState('overview')
  const [activeImg, setActiveImg] = useState(0)

  const SECTIONS = ['overview', 'area', 'map']

  return (
    <motion.div className="absolute inset-0 z-30 flex flex-col overflow-hidden"
      style={{background:t.bg}} initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}}
      transition={{type:'spring',stiffness:320,damping:38}}>

      <AnimatePresence>
        {naviMode&&<NaviOverlay target={naviTarget} onClose={()=>setNaviMode(false)}/>}
      </AnimatePresence>

      {/* Hero image */}
      <div className="relative flex-shrink-0" style={{height:240}}>
        <img src={prop.images[activeImg]||prop.heroImg} alt={prop.name}
          className="w-full h-full object-cover"
          onError={e=>{e.target.src=prop.image}}/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.1) 60%)'}}/>

        {/* Back button */}
        <button onClick={onBack} className="absolute top-12 left-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{background:'rgba(0,0,0,0.65)',backdropFilter:'blur(8px)'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>

        {/* Image dots */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5">
          {prop.images.map((_,i)=>(
            <button key={i} onClick={()=>setActiveImg(i)}
              className="rounded-full transition-all"
              style={{width:i===activeImg?16:6,height:6,background:i===activeImg?'white':'rgba(255,255,255,0.4)'}}/>
          ))}
        </div>

        {/* Property info */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-display font-bold text-white"
              style={{background:prop.color+'cc'}}>{prop.nights} nights</span>
            <span className="text-xs" style={{color:'rgba(255,255,255,0.7)'}}>⭐ {prop.rating}</span>
          </div>
          <p className="font-display font-black text-xl text-white leading-tight">{prop.name}</p>
          <p className="text-xs text-white/60 mt-0.5">{prop.city}</p>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mx-4 mt-3 mb-3 p-1 rounded-2xl flex-shrink-0"
        style={{background:t.surface,border:`1px solid ${t.border}`}}>
        {SECTIONS.map(s=>{
          const active=activeSection===s
          return(
            <button key={s} onClick={()=>setActiveSection(s)}
              className="flex-1 py-2 rounded-xl font-display font-bold capitalize transition-all"
              style={{fontSize:11,background:active?t.brandBg:'transparent',border:active?`1px solid ${prop.color}44`:'1px solid transparent',color:active?prop.color:t.textMuted}}>
              {s}
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto hide-scroll px-4 pb-4">
        {/* Overview */}
        {activeSection==='overview'&&(
          <div className="space-y-4">
            {/* Stay card */}
            <div className="p-4 rounded-3xl" style={{background:t.surface,border:`1px solid ${t.border}`}}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-display font-black text-sm" style={{color:t.text}}>Your Stay</p>
                  <p className="text-xs mt-0.5" style={{color:t.textMuted}}>{prop.checkIn} → {prop.checkOut}</p>
                </div>
                <div className="px-3 py-1.5 rounded-full"
                  style={{background:prop.color+'22',border:`1px solid ${prop.color}44`}}>
                  <span className="font-display font-black text-sm" style={{color:prop.color}}>{prop.nights}N</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{color:t.textMuted}}>{prop.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <p className="font-display font-bold text-xs mb-2" style={{color:t.textMuted}}>AMENITIES</p>
              <div className="grid grid-cols-2 gap-1.5">
                {prop.amenities.map((a,i)=>(
                  <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{background:t.surface,border:`1px solid ${t.border}`}}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:prop.color}}/>
                    <span className="text-xs leading-tight" style={{color:t.text}}>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigate */}
            <button onClick={()=>setNaviMode(true,{name:prop.name,address:prop.address})}
              className="w-full py-3.5 rounded-2xl font-display font-black text-sm text-white"
              style={{background:`linear-gradient(135deg,${prop.color},${prop.color}aa)`,boxShadow:`0 8px 28px ${prop.color}44`}}>
              Navigate to {prop.name}
            </button>
          </div>
        )}

        {/* Area */}
        {activeSection==='area'&&(
          <div className="space-y-3">
            {Object.entries(prop.area).map(([key,items])=>(
              <div key={key} className="rounded-2xl overflow-hidden"
                style={{background:t.surface,border:`1px solid ${t.border}`}}>
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{borderColor:t.border}}>
                  <AreaIcon type={key} size={18}/>
                  <p className="font-display font-bold text-sm" style={{color:t.text}}>{AREA_LABELS[key]}</p>
                </div>
                <div className="px-4 py-2">
                  {items.map((item,i)=>(
                    <div key={i} className="flex items-start gap-2 py-2 border-b last:border-0"
                      style={{borderColor:t.border}}>
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{background:prop.color}}/>
                      <p className="text-xs leading-relaxed" style={{color:t.textMuted}}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map */}
        {activeSection==='map'&&(
          <div className="space-y-3">
            <div className="rounded-3xl overflow-hidden" style={{height:280}}>
              <MapboxMap lat={prop.lat} lng={prop.lng} color={prop.color}/>
            </div>
            <div className="p-3 rounded-2xl" style={{background:t.surface,border:`1px solid ${t.border}`}}>
              <p className="text-xs font-display font-bold mb-1" style={{color:t.textMuted}}>ADDRESS</p>
              <p className="text-sm font-display font-semibold" style={{color:t.text}}>{prop.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Walk','Transit','Drive','Taxi'].map(mode=>(
                <button key={mode} onClick={()=>setNaviMode(true,{name:prop.name,address:prop.address})}
                  className="py-2.5 rounded-xl font-display font-bold text-xs"
                  style={{background:t.surface,border:`1px solid ${t.border}`,color:t.textMuted}}>
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function HousingView() {
  const { theme } = useStore()
  const t = getTheme(theme)
  const [selected, setSelected] = useState(null)

  const totalNights = PROPERTIES.reduce((s,p)=>s+p.nights,0)

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {selected&&<PropertyDetail prop={selected} onBack={()=>setSelected(null)}/>}
      </AnimatePresence>

      {/* Journey summary */}
      <div className="mx-4 mb-4 p-4 rounded-3xl"
        style={{background:t.surface,border:`1px solid ${t.border}`}}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-display font-black text-base" style={{color:t.text}}>Your Journey</p>
            <p className="text-xs mt-0.5" style={{color:t.textMuted}}>May 15 – June 8, 2025 · {totalNights} nights</p>
          </div>
          <div className="flex -space-x-2">
            {PROPERTIES.map(p=>(
              <div key={p.id} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-black text-white"
                style={{background:p.color,border:'2px solid #09090b'}}>{p.emoji}</div>
            ))}
          </div>
        </div>
        {/* Journey timeline */}
        <div className="flex items-center gap-0">
          {PROPERTIES.map((p,i)=>(
            <div key={p.id} className="flex items-center" style={{flex:p.nights}}>
              <div className="flex-1 h-2 rounded-full" style={{background:p.color+'88',minWidth:4}}/>
              {i<PROPERTIES.length-1&&(
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{background:'rgba(255,255,255,0.3)'}}/>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {PROPERTIES.map(p=>(
            <span key={p.id} className="text-[9px] font-mono" style={{color:p.color}}>{p.emoji} {p.nights}N</span>
          ))}
        </div>
      </div>

      {/* Property cards */}
      <div className="flex-1 overflow-y-auto hide-scroll px-4 pb-2 space-y-3">
        {PROPERTIES.map((prop,i)=>(
          <motion.button key={prop.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            transition={{delay:i*0.1}} onClick={()=>setSelected(prop)}
            className="w-full rounded-3xl overflow-hidden text-left"
            style={{background:t.surface,border:`1px solid ${t.border}`}}>
            <div className="relative" style={{height:160}}>
              <img src={prop.image} alt={prop.name} className="w-full h-full object-cover"
                onError={e=>{e.target.src=prop.heroImg}}/>
              <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 55%)'}}/>
              {/* City badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{background:prop.color+'ee',backdropFilter:'blur(8px)'}}>
                <span className="text-xs font-display font-black text-white">{prop.emoji}</span>
              </div>
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-mono font-bold"
                style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(8px)',color:'white'}}>
                {prop.nights} nights
              </div>
              <div className="absolute bottom-3 left-3">
                <p className="font-display font-black text-base text-white">{prop.name}</p>
                <p className="text-xs text-white/60 mt-0.5">{prop.checkIn} → {prop.checkOut}</p>
              </div>
            </div>
            {/* Quick area pills */}
            <div className="p-3 flex items-center gap-2 overflow-x-auto hide-scroll">
              {['shops','atms','transit','sim'].map(k=>(
                <span key={k} className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-display font-bold"
                  style={{background:prop.color+'18',color:prop.color,border:`1px solid ${prop.color}44`}}>
                  <AreaIcon type={k} size={12}/> {AREA_LABELS[k].split(' ')[0]}
                </span>
              ))}
              <span className="flex-shrink-0 text-xs font-display font-bold ml-auto flex items-center gap-1" style={{color:t.textMuted}}>
                View →
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
