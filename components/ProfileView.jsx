import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'
import toast from 'react-hot-toast'

// ─── SVG Icons ──────────────────────────────────────────
const IconWallet = () => <span className="text-xl">💳</span>
const IconHeart = () => <span className="text-xl">❤️</span>
const IconSim = () => <span className="text-xl">📶</span>
const IconMoney = () => <span className="text-xl">💴</span>
const IconPlay = () => <span className="text-xl">▶️</span>
const IconFlight = () => <span className="text-xl">✈️</span>
const IconCamera = () => <span className="text-xl">📸</span>
const IconSettings = () => <span className="text-xl">⚙️</span>

// ─── SUB-PANELS ─────────────────────────────────────────

function WalletPanel({ onNavigateToMap }) {
  const ATMs = [
    { name: '7-Eleven ATM', dist: '120m', hours: '24/7', free: true, lat: 35.0116, lng: 135.7681 },
    { name: 'Japan Post Bank ATM', dist: '340m', hours: '9am–9pm', free: false, lat: 35.0150, lng: 135.7700 },
    { name: 'Lawson ATM', dist: '550m', hours: '24/7', free: false, lat: 35.0125, lng: 135.7600 },
  ]
  const [showWalletBridge, setShowWalletBridge] = useState(false)
  const [bridgeStep, setBridgeStep] = useState(0)

  const handleAddFunds = () => {
    setShowWalletBridge(true)
    setBridgeStep(0)
    setTimeout(() => setBridgeStep(1), 1000)
    setTimeout(() => setBridgeStep(2), 2500)
    setTimeout(() => { setShowWalletBridge(false); toast.success('Added ¥5,000 to Suica via Apple Pay!') }, 4500)
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-black text-white p-5 rounded-3xl shadow-xl flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl"></div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Apple Pay Ready</p>
            <p className="text-[10px] text-white/40 mt-1">Tap to pay transit & stores</p>
          </div>
          <span className="text-2xl opacity-90">🍏</span>
        </div>
        <div>
          <p className="font-display font-black text-4xl m-0 tracking-tight">Suica ID</p>
          <p className="font-mono text-sm text-white/60 m-0 mt-1">**** **** 1234 5678</p>
        </div>
        <button className="w-full bg-white text-black font-bold py-3 rounded-xl mt-2 active:scale-95 transition-transform" onClick={handleAddFunds}>
          Add Funds via Apple Wallet
        </button>
      </div>

      <AnimatePresence>
        {showWalletBridge && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-white rounded-t-3xl pt-2 pb-10 px-6 shadow-2xl relative">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-xl">🍏</div>
                <div>
                  <h3 className="font-display font-black text-xl text-black m-0">Apple Pay</h3>
                  <p className="text-xs text-gray-500 font-semibold m-0">Connecting to Wallet...</p>
                </div>
              </div>
              <div className="h-24 flex items-center justify-center">
                {bridgeStep === 0 && <span className="animate-spin text-3xl">⏳</span>}
                {bridgeStep === 1 && <span className="text-4xl animate-pulse">💳</span>}
                {bridgeStep === 2 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 text-5xl">✅</motion.span>}
              </div>
              <p className="text-center font-bold text-gray-800">
                {bridgeStep === 0 && 'Verifying with Apple...'}
                {bridgeStep === 1 && 'Adding ¥5,000 to Suica...'}
                {bridgeStep === 2 && 'Done!'}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-5 rounded-3xl shadow-sm border border-gray-100" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-display font-bold text-lg m-0 mb-3" style={{ color: 'var(--text)' }}>Nearby ATMs</h3>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>7-Eleven and Japan Post are the most reliable for foreign debit/credit cards.</p>
        <div className="space-y-2">
          {ATMs.map(atm => (
            <div key={atm.name} className="flex justify-between items-center p-3 rounded-2xl border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <div>
                <p className="font-bold text-sm m-0 leading-tight">{atm.name}</p>
                <p className="text-[10px] text-gray-500 m-0 mt-0.5">{atm.hours} • {atm.free ? 'Free' : 'Fee applies'}</p>
              </div>
              <button
                onClick={() => onNavigateToMap?.({ name: atm.name, lat: atm.lat, lng: atm.lng, icon: '🏧' })}
                className="bg-brand text-white text-[10px] font-bold px-3 py-2 rounded-xl active:scale-95 transition-transform">
                Navigate ({atm.dist})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FinancePanel() {
  const [liveRate, setLiveRate] = useState(null)
  const [usdInput, setUsdInput] = useState('10')
  const [jpyInput, setJpyInput] = useState('')
  const [activeInput, setActiveInput] = useState('usd')

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(r => r.json())
      .then(d => setLiveRate(d.rates.JPY))
      .catch(() => setLiveRate(148.5)) // fallback if offline
  }, [])

  const currentRate = liveRate || 148.5
  const displayUsd = activeInput === 'usd' ? usdInput : (jpyInput / currentRate).toFixed(2)
  const displayJpy = activeInput === 'jpy' ? jpyInput : Math.round(usdInput * currentRate)

  const BUDGET = [
    { cat: 'Meals', price: '¥2,500' },
    { cat: 'Transit', price: '¥600' },
    { cat: 'Activities', price: '¥1,000' },
  ]

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-5 rounded-3xl shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display font-bold text-lg m-0 leading-tight" style={{ color: 'var(--text)' }}>Live Converter</h3>
          <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg">
            LIVE: ¥{currentRate.toFixed(2)}
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 p-3 rounded-2xl border relative" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold tracking-widest uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>USD $</span>
              <input type="number"
                value={activeInput === 'usd' ? usdInput : displayUsd}
                onChange={e => { setActiveInput('usd'); setUsdInput(e.target.value) }}
                className="w-full bg-transparent text-xl font-black outline-none" />
            </div>
            <div className="flex-1 p-3 rounded-2xl border relative" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold tracking-widest uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>JPY ¥</span>
              <input type="number"
                value={activeInput === 'jpy' ? jpyInput : displayJpy}
                onChange={e => { setActiveInput('jpy'); setJpyInput(e.target.value) }}
                className="w-full bg-transparent text-xl font-black outline-none text-brand" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-3xl shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-display font-bold text-lg m-0 mb-3" style={{ color: 'var(--text)' }}>Daily Budget</h3>
        <div className="space-y-2 mb-4">
          {BUDGET.map(b => (
            <div key={b.cat} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{b.cat}</span>
              <span className="text-sm font-display font-bold text-brand">{b.price}</span>
            </div>
          ))}
        </div>
        <div className="p-4 bg-brand rounded-2xl text-white flex justify-between items-center">
          <span className="font-bold text-sm">Target Daily Top</span>
          <span className="font-display font-black text-xl">¥4,100</span>
        </div>
      </div>
    </div>
  )
}

function PhotoReelPanel() {
  const fileRef = useRef(null)
  const [photos, setPhotos] = useState([])
  const [activePhotoModal, setActivePhotoModal] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [slideIdx, setSlideIdx] = useState(0)

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      setPhotos(p => [...p, { id: Date.now() + Math.random(), url, caption: '' }])
    })
  }

  const saveCaption = (id, cap) => {
    setPhotos(p => p.map(x => x.id === id ? { ...x, caption: cap } : x))
    setActivePhotoModal(null)
  }

  useEffect(() => {
    let int
    if (playing) {
      int = setInterval(() => {
        setSlideIdx(i => {
          if (i >= photos.length - 1) { setPlaying(false); return 0 }
          return i + 1
        })
      }, 2500)
    }
    return () => clearInterval(int)
  }, [playing, photos.length])

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">

      {playing && photos.length > 0 ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col pt-12 pb-8 px-4 justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={slideIdx} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative flex-1 rounded-3xl overflow-hidden shadow-2xl">
              <img src={photos[slideIdx].url} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-6 right-6 text-center">
                <p className="font-display font-black text-2xl text-white mb-4 drop-shadow-lg">{photos[slideIdx].caption || 'Memories in Japan 🇯🇵'}</p>
                <div className="flex justify-center gap-1.5 opacity-60">
                  {photos.map((_, i) => <div key={i} className={`h-1 rounded-full ${i === slideIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} />)}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <button onClick={() => setPlaying(false)} className="mt-8 mx-auto w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white text-xl flex items-center justify-center">×</button>
        </div>
      ) : (
        <div className="p-5 rounded-3xl shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-display font-bold text-lg m-0 leading-tight" style={{ color: 'var(--text)' }}>Trip Reel</h3>
              <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>Stored in Google Photos Album</p>
            </div>
            {photos.length > 0 && (
              <button onClick={() => { setSlideIdx(0); setPlaying(true) }} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">▶</button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {photos.map(p => (
              <div key={p.id} onClick={() => setActivePhotoModal(p)} className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-sm">
                <img src={p.url} className="w-full h-full object-cover" />
                {p.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-[9px] text-white font-bold truncate">
                    {p.caption}
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => fileRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <span className="text-2xl">+</span>
              <span className="text-[10px] font-bold">Add Photo</span>
            </button>
          </div>
          <input ref={fileRef} type="file" multiple className="hidden" onChange={handleUpload} />

          {photos.length === 0 && (
            <div className="text-center mt-6 mb-2">
              <span className="text-4xl opacity-50 block mb-2">🖼️</span>
              <p className="text-sm font-semibold m-0" style={{ color: 'var(--text-muted)' }}>Your reel is empty</p>
              <p className="text-xs m-0 mt-1" style={{ color: 'var(--text-muted)' }}>Upload photos to create a cinematic recap of your study abroad experience.</p>
            </div>
          )}
        </div>
      )}

      {/* Comment / Caption Modal */}
      <AnimatePresence>
        {activePhotoModal && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'var(--surface)' }}>
              <div className="w-full aspect-square bg-black">
                <img src={activePhotoModal.url} className="w-full h-full object-contain" />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Add Caption</p>
                <input type="text" autoFocus
                  defaultValue={activePhotoModal.caption}
                  onKeyDown={e => { if (e.key === 'Enter') saveCaption(activePhotoModal.id, e.target.value) }}
                  className="w-full p-3 rounded-xl border outline-none text-sm mb-4"
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  placeholder="E.g., Amazing matcha in Kyoto..."
                  id={`cap-${activePhotoModal.id}`}
                />
                <div className="flex gap-2">
                  <button onClick={() => setActivePhotoModal(null)} className="flex-1 py-3 rounded-xl font-bold text-sm" style={{ background: 'var(--surface2)', color: 'var(--text)' }}>Cancel</button>
                  <button onClick={() => saveCaption(activePhotoModal.id, document.getElementById(`cap-${activePhotoModal.id}`).value)} className="flex-1 py-3 rounded-xl font-bold text-sm" style={{ background: 'var(--text)', color: 'var(--bg)' }}>Save</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

function UniversalPanel({ title, content }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-6 rounded-3xl shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-display font-black text-xl m-0 mb-4" style={{ color: 'var(--text)' }}>{title}</h3>
        {content}
      </div>
    </div>
  )
}

function HealthPanel() {
  const HOSPITALS = [
    { name: 'Red Cross Hospital Tokyo', dist: '1.2km', phone: '03-3400-1311', type: 'General' },
    { name: 'Kyoto University Hospital', dist: '3.4km', phone: '075-751-3111', type: 'University' },
  ]
  const PHRASES = [
    { eng: 'Please help!', jp: '助けてください (Tasukete kudasai)' },
    { eng: 'Call an ambulance', jp: '救急車を呼んでください (Kyukyusha wo yonde kudasai)' },
    { eng: 'I have allergies', jp: 'アレルギーがあります (Arerugi ga arimasu)' }
  ]
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-5 rounded-3xl shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-display font-bold text-lg m-0 mb-3" style={{ color: 'var(--text)' }}>Emergency Contacts</h3>
        <div className="flex gap-2">
          <div className="flex-1 bg-red-100 dark:bg-red-500/20 p-4 rounded-2xl flex flex-col items-center justify-center">
            <span className="font-black text-2xl text-red-600 dark:text-red-400">119</span>
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mt-1">Ambulance</span>
          </div>
          <div className="flex-1 bg-blue-100 dark:bg-blue-500/20 p-4 rounded-2xl flex flex-col items-center justify-center">
            <span className="font-black text-2xl text-blue-600 dark:text-blue-400">110</span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">Police</span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-3xl shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-display font-bold text-lg m-0 mb-3" style={{ color: 'var(--text)' }}>Nearby Hospitals (English)</h3>
        <div className="space-y-2">
          {HOSPITALS.map((h, i) => (
            <div key={i} className="p-3 rounded-2xl border flex justify-between items-center" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <div>
                <h4 className="font-bold text-sm m-0" style={{ color: 'var(--text)' }}>{h.name}</h4>
                <p className="text-[10px] font-bold m-0 mt-0.5" style={{ color: 'var(--brand)' }}>{h.phone}</p>
              </div>
              <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{h.dist}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-3xl shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-display font-bold text-lg m-0 mb-3" style={{ color: 'var(--text)' }}>Medical Phrases</h3>
        <div className="space-y-3">
          {PHRASES.map(p => (
            <div key={p.eng}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{p.eng}</p>
              <p className="text-sm font-semibold m-0" style={{ color: 'var(--text)' }}>{p.jp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AirfarePanel() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-5 rounded-3xl shadow-sm border" style={{ background: 'var(--brand)', borderColor: 'var(--brand-light)', color: 'white' }}>
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold uppercase tracking-widest text-[10px] opacity-80">Departure</span>
          <span className="font-bold uppercase tracking-widest text-[10px] opacity-80">American Airlines</span>
        </div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="font-display font-black text-4xl m-0">DFW</p>
            <p className="text-xs opacity-80 mt-1">Dallas</p>
          </div>
          <div className="flex-1 px-4 text-center pb-2 relative">
            <div className="w-full border-t-2 border-dashed border-white/40 absolute bottom-4"></div>
            <span className="text-2xl relative z-10">✈️</span>
          </div>
          <div className="text-right">
            <p className="font-display font-black text-4xl m-0">NRT</p>
            <p className="text-xs opacity-80 mt-1">Tokyo (Narita)</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-4">
          <div>
            <span className="block text-[9px] uppercase tracking-widest opacity-70 mb-1">Date</span>
            <span className="font-bold text-sm">May 12, 2026</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase tracking-widest opacity-70 mb-1">Gate</span>
            <span className="font-bold text-sm">Terminal D</span>
          </div>
          <div className="text-right">
            <span className="block text-[9px] uppercase tracking-widest opacity-70 mb-1">Flight</span>
            <span className="font-bold text-sm">AA175</span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-3xl shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-display font-bold text-lg m-0 mb-3" style={{ color: 'var(--text)' }}>Flight Pricing</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Ticket</span>
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>$1,245.00</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Baggage (2 Checked)</span>
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Included</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Total</span>
          <span className="text-lg font-black" style={{ color: 'var(--brand)' }}>$1,245.00</span>
        </div>
      </div>
    </div>
  )
}

function SimPanel() {
  const PLANS = [
    { title: 'Airalo Ubigi eSIM', data: '10GB', days: '30 Days', price: '$15.00', rec: true },
    { title: 'Sakura Mobile', data: 'Unlimited', days: '30 Days', price: '¥5,000' }
  ]
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-5 rounded-3xl shadow-sm border bg-gradient-to-br from-blue-500/20 to-purple-500/20" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-display font-black text-2xl m-0 mb-2" style={{ color: 'var(--text)' }}>Stay Connected</h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Download your eSIM before you leave the US. You can activate it instantly using the Narita airport free Wi-Fi.</p>
        <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl mt-4 active:scale-95 transition-transform" onClick={() => toast.success('Scanning for eSIM profiles...')}>Install eSIM Now</button>
      </div>

      <div className="p-5 rounded-3xl shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-display font-bold text-lg m-0 mb-3" style={{ color: 'var(--text)' }}>Recommended Plans</h3>
        <div className="space-y-2">
          {PLANS.map((p, i) => (
            <div key={i} className="p-3 rounded-2xl border flex justify-between items-center" style={{ background: 'var(--surface2)', borderColor: p.rec ? 'var(--brand)' : 'var(--border)' }}>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm m-0" style={{ color: 'var(--text)' }}>{p.title}</h4>
                  {p.rec && <span className="text-[8px] font-bold bg-brand text-white px-2 py-0.5 rounded-full uppercase">Best</span>}
                </div>
                <p className="text-[10px] font-semibold m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.data} • {p.days}</p>
              </div>
              <span className="text-sm font-black" style={{ color: 'var(--text)' }}>{p.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PROFILE VIEW ───────────────────────────────────

export default function ProfileView({ onNavigateToMap, onSignOut }) {
  const { user } = useStore()
  const [activeSection, setActiveSection] = useState(null)
  const [questsEnabled, setQuestsEnabled] = useState(false)

  const SECTIONS = [
    { id: 'wallet', title: 'Wallet & ATM', icon: <IconWallet />, desc: 'Apple Pay, Suica, Cash' },
    { id: 'finance', title: 'Finance & Tips', icon: <IconMoney />, desc: 'Live rates, Daily budget' },
    { id: 'reel', title: 'Photo Reel', icon: <IconCamera />, desc: 'Generate cinematic memories' },
    { id: 'health', title: 'Health & Safety', icon: <IconHeart />, desc: 'Hospitals, emergency words' },
    { id: 'airfare', title: 'Airfare & Travel', icon: <IconFlight />, desc: 'Itinerary, Transport' },
    { id: 'sim', title: 'SIM & Data', icon: <IconSim />, desc: 'Wi-Fi, connectivity' },
  ]

  if (activeSection) {
    return (
      <div className="px-5 pb-6">
        <button onClick={() => setActiveSection(null)} className="mb-4 flex items-center gap-2 text-brand font-bold text-sm active:opacity-70">
          <span className="text-lg">←</span> Back to Profile
        </button>
        {activeSection === 'wallet' && <WalletPanel onNavigateToMap={onNavigateToMap} />}
        {activeSection === 'finance' && <FinancePanel />}
        {activeSection === 'reel' && <PhotoReelPanel />}
        {activeSection === 'health' && <HealthPanel />}
        {activeSection === 'airfare' && <AirfarePanel />}
        {activeSection === 'sim' && <SimPanel />}
      </div>
    )
  }

  return (
    <div className="px-5 pb-20 space-y-6">

      {/* Settings Bar */}
      <div className="flex justify-between items-center pt-2">
        <h1 className="font-display font-black text-2xl m-0" style={{ color: 'var(--text)' }}>My Profile</h1>
        <button className="text-xl rotate-0 active:rotate-45 transition-transform"><IconSettings /></button>
      </div>

      {/* Identity Card */}
      <div className="p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border relative overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Abstract BG */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="flex items-center gap-4 relative z-10 mb-5">
          <img src="https://i.pravatar.cc/150?img=33" className="w-16 h-16 rounded-full border-2 border-[var(--surface2)] shadow-md object-cover" />
          <div>
            <h2 className="font-display font-black text-xl m-0 leading-tight" style={{ color: 'var(--text)' }}>Student</h2>
            <p className="font-body text-xs mt-1 font-semibold tracking-wide" style={{ color: 'var(--text-muted)' }}>UNIVERSITY OF OKLAHOMA</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Course Hours</span>
            <p className="font-black text-lg m-0 mt-0.5" style={{ color: 'var(--text)' }}>45 Hrs</p>
          </div>
          <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Class Size</span>
            <p className="font-black text-lg m-0 mt-0.5" style={{ color: 'var(--text)' }}>25 Pax</p>
          </div>
          <div className="bg-brand/10 p-3 rounded-2xl border border-brand/20 col-span-2 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand tracking-wider">Return Home Flight</span>
              <p className="font-black text-lg text-brand m-0 mt-0.5">18 Days Left</p>
            </div>
            <span className="text-3xl opacity-80">🛫</span>
          </div>
        </div>
      </div>

      {/* Live Map Widget */}
      <div className="p-4 rounded-3xl shadow-sm border flex justify-between items-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Current City</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xl">📍</span>
            <span className="font-display font-black text-xl tracking-tight" style={{ color: 'var(--text)' }}>Tokyo, Japan</span>
          </div>
        </div>
        <button onClick={() => onNavigateToMap?.(null)} className="px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform" style={{ background: 'var(--surface2)', color: 'var(--text)' }}>
          Open Map
        </button>
      </div>

      {/* Tools Grid */}
      <div>
        <h3 className="font-display font-black text-lg m-0 mb-3 ml-1" style={{ color: 'var(--text)' }}>Essentials</h3>
        <div className="grid grid-cols-2 gap-3">
          {SECTIONS.map(s => (
            <div key={s.id} onClick={() => setActiveSection(s.id)} className="p-4 rounded-3xl shadow-sm border cursor-pointer active:scale-[0.98] transition-all group" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 group-hover:bg-brand/10 transition-colors" style={{ background: 'var(--surface2)' }}>
                {s.icon}
              </div>
              <h4 className="font-display font-bold text-sm m-0" style={{ color: 'var(--text)' }}>{s.title}</h4>
              <p className="text-[10px] font-medium m-0 mt-1 leading-snug" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gamification Toggle (Hidden by default but viewable) */}
      <div className="p-4 rounded-3xl border flex justify-between items-center cursor-pointer" onClick={() => setQuestsEnabled(!questsEnabled)} style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
        <div>
          <h4 className="font-display font-bold text-sm m-0" style={{ color: 'var(--text)' }}>Points & Quests Mode</h4>
          <p className="text-[10px] font-medium m-0 mt-0.5 leading-snug" style={{ color: 'var(--text-muted)' }}>Toggle gamification features</p>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${questsEnabled ? 'bg-brand' : ''}`} style={{ background: questsEnabled ? '' : 'var(--text-muted)' }}>
          <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${questsEnabled ? 'translate-x-6' : 'translate-x-0'}`} style={{ background: 'var(--bg)' }}></div>
        </div>
      </div>

      <button onClick={onSignOut} className="w-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-bold py-3.5 rounded-2xl active:scale-95 transition-transform shadow-sm border border-red-100 dark:border-red-500/20">
        Sign Out
      </button>

    </div>
  )
}
