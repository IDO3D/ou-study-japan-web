// components/ProfileView.jsx
// Full-featured profile portal: Auth, School, Wallet, Health, SIM, Finance, Photo Reel

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'
import { IcPhone, IcCheck, IcJapan, IcX, IcWallet, IcHeart, IcMoney, IcPlay, IcArrow, IcCamera, IcPin, IcTrophy, IcStar } from './ui/Icons'
import { formatJpy, jpyToUsd, formatUsd } from '../utils/helpers'
import toast from 'react-hot-toast'
import { getTheme } from '../utils/themes'
// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('signin') // signin | signup
  const [form, setForm] = useState({ name: '', email: '', password: '', university: 'University of Oklahoma', major: 'Marketing', year: 'Junior' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.email || !form.password) { toast.error('Fill in all fields'); return }
    if (mode === 'signup' && !form.name) { toast.error('Enter your name'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    toast.success(mode === 'signup' ? `Welcome, ${form.name}! ` : 'Welcome back! ')
    onAuth({ ...form, id: Date.now().toString(), avatarUrl: `https://i.pravatar.cc/150?u=${form.email}`, points: 2450, dailyBudgetJpy: 4500 })
  }

  return (
    <div className="min-h-full px-5 pb-6 flex flex-col justify-center" style={{ minHeight: 'calc(100vh - 180px)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ background: 'linear-gradient(135deg, #E02424, #FF8E53)', boxShadow: '0 8px 24px rgba(224,36,36,0.4)' }}>
            JP
          </div>
          <h2 className="text-3xl font-display font-black text-white" style={{ letterSpacing: '-0.03em' }}>
            OUStudyJapan
          </h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {mode === 'signup' ? 'Create your student passport' : 'Welcome back, explorer'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {['signin', 'signup'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 py-2.5 rounded-xl text-sm font-display font-bold transition-all"
              style={{ background: mode === m ? '#E02424' : 'transparent', color: mode === m ? 'white' : 'rgba(255,255,255,0.4)' }}>
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mode === 'signup' && (
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              placeholder="Full Name" className="input-field" />
          )}
          <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
            placeholder="OU Email (ou.edu)" type="email" className="input-field" />
          <input value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
            placeholder="Password" type="password" className="input-field" />

          {mode === 'signup' && (
            <>
              <select value={form.university} onChange={e => setForm(f => ({...f, university: e.target.value}))}
                className="input-field"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'white' }}>
                <option value="University of Oklahoma">University of Oklahoma</option>
                <option value="OU Health Sciences">OU Health Sciences</option>
                <option value="Cameron University">Cameron University</option>
              </select>
              <select value={form.major} onChange={e => setForm(f => ({...f, major: e.target.value}))}
                className="input-field" style={{ background: 'rgba(255,255,255,0.07)', color: 'white' }}>
                <option>Marketing</option>
                <option>Business Administration</option>
                <option>International Business</option>
                <option>Finance</option>
                <option>Management</option>
              </select>
              <select value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))}
                className="input-field" style={{ background: 'rgba(255,255,255,0.07)', color: 'white' }}>
                <option>Freshman</option><option>Sophomore</option>
                <option>Junior</option><option>Senior</option><option>Graduate</option>
              </select>
            </>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
            {loading ? <span className="animate-spin text-lg">⟳</span> : (mode === 'signup' ? ' Create Account' : '→ Sign In')}
          </button>
        </div>

        {/* Social sign-in */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-[10px] font-display" style={{ color: 'rgba(255,255,255,0.3)' }}>OR CONTINUE WITH</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>
          {[
            { icon: '', label: 'Continue with Apple', bg: 'rgba(255,255,255,0.95)', color: '#09090b' },
            { icon: 'G', label: 'Continue with Google', bg: 'rgba(255,255,255,0.08)', color: 'white' },
          ].map(s => (
            <button key={s.label} onClick={() => { toast.success('OAuth coming soon!'); onAuth({ name: 'Demo Student', email: 'demo@ou.edu', university: 'University of Oklahoma', major: 'Marketing', year: 'Junior', id: 'demo', avatarUrl: 'https://i.pravatar.cc/150?img=33', points: 2450, dailyBudgetJpy: 4500 }) }}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2.5 font-display font-bold text-sm active:scale-95 transition-transform"
              style={{ background: s.bg, color: s.color, border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-base">{s.icon}</span>{s.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ─── WALLET PANEL ─────────────────────────────────────────────────────────────
function WalletPanel({ exchangeRate }) {
  const [balance, setBalance] = useState(15400)
  const [usdBalance, setUsdBalance] = useState(320.00)
  const [addAmount, setAddAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [activeCard, setActiveCard] = useState('suica')
  const [tab, setTab] = useState('overview')

  const ATM_LOCATIONS = [
    { name: '7-Eleven ATM', dist: '120m', fee: 'Free (7am–11pm)', hours: '24/7', icon: '' },
    { name: 'Japan Post Bank ATM', dist: '340m', fee: '¥110', hours: '9am–9pm', icon: '' },
    { name: 'Lawson ATM', dist: '550m', fee: '¥220 (nights)', hours: '24/7', icon: '' },
    { name: 'AEON Bank ATM', dist: '820m', fee: 'Free (AEON card)', hours: '9am–8pm', icon: '' },
  ]

  const TRANSACTIONS = [
    { desc: 'Ichiran Ramen', amount: -980, type: 'food', time: 'Today 12:34' },
    { desc: 'JR Yamanote Line', amount: -200, type: 'transit', time: 'Today 10:01' },
    { desc: 'Top Up via Apple Pay', amount: +5000, type: 'topup', time: 'Yesterday' },
    { desc: 'FamilyMart Fried Chicken', amount: -390, type: 'food', time: 'Yesterday' },
    { desc: 'Kyoto Bus Day Pass', amount: -600, type: 'transit', time: '2 days ago' },
  ]

  const doTopUp = () => {
    const amt = parseInt(addAmount)
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return }
    setBalance(b => b + amt)
    setAddAmount('')
    toast.success(`+¥${amt.toLocaleString()} added to Suica`)
  }

  const doWithdraw = () => {
    const amt = parseInt(withdrawAmount)
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return }
    if (amt * exchangeRate > usdBalance) { toast.error('Insufficient USD balance'); return }
    setUsdBalance(b => parseFloat((b - amt * exchangeRate).toFixed(2)))
    setBalance(b => b + amt)
    setWithdrawAmount('')
    toast.success(`Converted $${(amt * exchangeRate).toFixed(2)} → ¥${amt.toLocaleString()} `)
  }

  return (
    <div className="space-y-4">
      {/* Cards */}
      <div className="flex gap-3 overflow-x-auto hide-scroll pb-1">
        {/* Suica */}
        <div onClick={() => setActiveCard('suica')}
          className={`flex-shrink-0 w-64 rounded-3xl p-5 cursor-pointer transition-all active:scale-95 ${activeCard === 'suica' ? 'ring-2 ring-blue-400' : ''}`}
          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F2340 100%)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] font-display font-bold uppercase tracking-widest text-blue-300">Suica Card</p>
              <p className="text-xs text-blue-200/60 mt-0.5">JR East · IC Card</p>
            </div>
            <span className="text-2xl"></span>
          </div>
          <p className="font-display font-black text-3xl text-white" style={{ letterSpacing: '-0.03em' }}>¥{balance.toLocaleString()}</p>
          <p className="text-xs text-blue-300/60 mt-1">≈ {formatUsd(jpyToUsd(balance, exchangeRate))}</p>
        </div>
        {/* USD Wallet */}
        <div onClick={() => setActiveCard('usd')}
          className={`flex-shrink-0 w-64 rounded-3xl p-5 cursor-pointer transition-all active:scale-95 ${activeCard === 'usd' ? 'ring-2 ring-green-400' : ''}`}
          style={{ background: 'linear-gradient(135deg, #064E3B 0%, #022c22 100%)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] font-display font-bold uppercase tracking-widest text-green-300">USD Wallet</p>
              <p className="text-xs text-green-200/60 mt-0.5">US Dollars · Connected</p>
            </div>
            <span className="text-2xl"></span>
          </div>
          <p className="font-display font-black text-3xl text-white">${usdBalance.toFixed(2)}</p>
          <p className="text-xs text-green-300/60 mt-1">≈ ¥{(usdBalance / exchangeRate).toLocaleString('ja-JP', {maximumFractionDigits: 0})}</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1.5 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {['overview','topup','atm','history'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl text-[9px] font-display font-bold uppercase tracking-wide transition-all active:scale-95"
            style={{ background: tab === t ? '#E02424' : 'transparent', color: tab === t ? 'white' : 'rgba(255,255,255,0.35)' }}>
            {''} {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Today Spent', val: '¥1,570', sub: '≈ $10.53', color: '#F87171' },
              { label: 'This Week', val: '¥8,240', sub: '≈ $55.21', color: '#FCD34D' },
              { label: 'Rate Today', val: '¥149/$1', sub: 'Live rate', color: '#86efac' },
              { label: 'Suica Balance', val: `¥${balance.toLocaleString()}`, sub: 'IC Card', color: '#60A5FA' },
            ].map(s => (
              <div key={s.label} className="p-3.5 rounded-2xl"
                style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[9px] font-display font-bold uppercase tracking-widest mb-1"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                <p className="font-display font-black text-white text-base" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.sub}</p>
              </div>
            ))}
          </div>
          {/* Apple / Google Pay pills */}
          <div className="flex gap-2">
            {[
              { icon: '', label: 'Apple Wallet', sub: 'Add Suica to iPhone', color: 'rgba(255,255,255,0.95)', textColor: '#09090b' },
              { icon: 'G', label: 'Google Wallet', sub: 'Add to Android', color: 'rgba(79,70,229,0.2)', textColor: 'white' },
            ].map(w => (
              <button key={w.label} onClick={() => toast.success(`Opening ${w.label}...`)}
                className="flex-1 p-3 rounded-2xl flex items-center gap-2 active:scale-95 transition-transform"
                style={{ background: w.color, border: '1px solid rgba(255,255,255,0.1)', color: w.textColor }}>
                <span className="text-xl">{w.icon}</span>
                <div className="text-left">
                  <p className="text-xs font-display font-black">{w.label}</p>
                  <p className="text-[9px] opacity-60">{w.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'topup' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl" style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-display font-bold text-white mb-3">Add to Suica (JPY)</p>
            <div className="flex gap-2">
              <input value={addAmount} onChange={e => setAddAmount(e.target.value)} type="number"
                placeholder="Amount in ¥" className="input-field flex-1" />
              <button onClick={doTopUp} className="btn-primary px-4 text-sm flex-shrink-0">Add</button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {[1000,2000,3000,5000].map(a => (
                <button key={a} onClick={() => setAddAmount(a.toString())}
                  className="px-3 py-1.5 rounded-xl text-xs font-display font-bold active:scale-95 transition-transform"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  ¥{a.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl" style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-display font-bold text-white mb-3">Convert USD → JPY (to Suica)</p>
            <div className="flex gap-2">
              <input value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} type="number"
                placeholder="¥ to receive" className="input-field flex-1" />
              <button onClick={doWithdraw} className="btn-ghost px-3 text-sm flex-shrink-0">Convert</button>
            </div>
            {withdrawAmount && <p className="text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Cost: ${(parseInt(withdrawAmount||0) * exchangeRate).toFixed(2)} from USD Wallet
            </p>}
          </div>
        </div>
      )}

      {tab === 'atm' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl flex gap-2" style={{ background: 'rgba(91,138,94,0.1)', border: '1px solid rgba(91,138,94,0.25)' }}>
            <span></span>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <strong className="text-white">7-Eleven & Japan Post ATMs</strong> are best for foreign cards. Use your US debit card with the Visa/Mastercard logo.
            </p>
          </div>
          {ATM_LOCATIONS.map(atm => (
            <div key={atm.name} className="flex items-center gap-3 p-4 rounded-2xl active:scale-[0.98] transition-transform"
              style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-2xl">{atm.icon}</span>
              <div className="flex-1">
                <p className="font-display font-bold text-white text-sm">{atm.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {atm.hours} · Fee: {atm.fee}
                </p>
              </div>
              <span className="text-xs font-display font-bold" style={{ color: '#86efac' }}>{atm.dist}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-1">
          {TRANSACTIONS.map((tx, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: tx.amount > 0 ? 'rgba(91,138,94,0.2)' : 'rgba(224,36,36,0.12)' }}>
                {''}
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-white text-xs">{tx.desc}</p>
                <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{tx.time}</p>
              </div>
              <p className={`font-display font-black text-sm ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                {tx.amount > 0 ? '+' : ''}¥{Math.abs(tx.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── HEALTH PANEL ─────────────────────────────────────────────────────────────
function HealthPanel() {
  const [allergies, setAllergies] = useState(['None'])
  const [newAllergy, setNewAllergy] = useState('')
  const [bloodType, setBloodType] = useState('A+')
  const [insurance, setInsurance] = useState('OU Student Insurance')

  const HOSPITALS = [
    { name: 'Osaka University Hospital', dist: '2.4km', phone: '+81-6-6879-5111', eng: true, emoji: '🏥' },
    { name: 'Kyoto University Hospital', dist: '1.1km', phone: '+81-75-751-3111', eng: true, emoji: '🏥' },
    { name: 'Tokyo Medical University', dist: '0.8km', phone: '+81-3-3342-6111', eng: true, emoji: '🏥' },
    { name: 'AMDA Osaka Clinic', dist: '3.2km', phone: '+81-6-4395-0555', eng: true, emoji: '🏥', note: 'English-speaking' },
  ]

  const EMERGENCY_PHRASES = [
    { jp: '助けてください', rom: 'Tasukete kudasai', en: 'Please help me!' },
    { jp: '救急車を呼んでください', rom: 'Kyūkyūsha wo yonde kudasai', en: 'Please call an ambulance' },
    { jp: 'アレルギーがあります', rom: 'Arerugī ga arimasu', en: 'I have allergies' },
    { jp: '具合が悪いです', rom: 'Guai ga warui desu', en: "I don't feel well" },
    { jp: '保険証を持っています', rom: 'Hokenshō wo motte imasu', en: 'I have insurance' },
  ]

  return (
    <div className="space-y-4">
      {/* Emergency Banner */}
      <div className="p-4 rounded-2xl flex items-center gap-3"
        style={{ background: 'rgba(224,36,36,0.12)', border: '1px solid rgba(224,36,36,0.3)' }}>
        <span className="text-3xl"></span>
        <div>
          <p className="font-display font-black text-white">Japan Emergency Numbers</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Police: <strong className="text-white">110</strong> · Ambulance/Fire: <strong className="text-white">119</strong> · English: <strong className="text-white">+81-3-3501-0110</strong>
          </p>
        </div>
      </div>

      {/* Medical Profile */}
      <div className="p-4 rounded-2xl space-y-3"
        style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.35)' }}>Medical Profile</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Blood Type</p>
            <select value={bloodType} onChange={e => setBloodType(e.target.value)}
              className="input-field text-sm py-2" style={{ background: 'rgba(255,255,255,0.07)', color: 'white' }}>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Insurance</p>
            <select value={insurance} onChange={e => setInsurance(e.target.value)}
              className="input-field text-sm py-2" style={{ background: 'rgba(255,255,255,0.07)', color: 'white' }}>
              <option>OU Student Insurance</option>
              <option>Travel Insurance</option>
              <option>Parent's Plan</option>
            </select>
          </div>
        </div>

        {/* Allergies */}
        <div>
          <p className="text-[10px] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Allergies / Dietary Restrictions</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {allergies.map(a => (
              <span key={a} onClick={() => setAllergies(arr => arr.filter(x => x !== a))}
                className="badge badge-brand text-[10px] cursor-pointer">
                {a} ×
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newAllergy} onChange={e => setNewAllergy(e.target.value)}
              placeholder="e.g. Shellfish, Gluten, Nuts..." className="input-field flex-1 text-xs py-2" />
            <button onClick={() => { if (newAllergy.trim()) { setAllergies(a => [...a.filter(x=>x!=='None'), newAllergy.trim()]); setNewAllergy('') }}}
              className="btn-primary px-3 text-sm">+</button>
          </div>
        </div>

        {/* In Japanese */}
        {allergies.filter(a => a !== 'None').length > 0 && (
          <div className="p-3 rounded-xl" style={{ background: 'rgba(224,36,36,0.08)', border: '1px solid rgba(224,36,36,0.2)' }}>
            <p className="text-[9px] font-display font-bold uppercase tracking-widest mb-1" style={{ color: '#FF8E8E' }}>
              Show to restaurant staff:
            </p>
            <p className="font-jp text-white text-sm">
              私は{allergies.filter(a=>a!=='None').join('と')}アレルギーがあります。
            </p>
            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              "I am allergic to {allergies.filter(a=>a!=='None').join(' and ')}."
            </p>
          </div>
        )}
      </div>

      {/* Nearest Hospitals */}
      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-2"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Nearest Hospitals (English-Friendly)</p>
        {HOSPITALS.map(h => (
          <div key={h.name} className="flex items-center gap-3 p-3.5 mb-2 rounded-2xl active:scale-[0.98] transition-transform"
            style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-white text-xs truncate">{h.name}</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{h.phone}</p>
              {h.note && <span className="badge badge-green text-[8px] mt-0.5">{h.note}</span>}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-display font-bold" style={{ color: '#86efac' }}>{h.dist}</p>
              <button onClick={() => toast.success(`Calling ${h.name}...`)}
                className="text-[9px] font-display font-bold mt-0.5" style={{ color: '#E02424' }}>Call</button>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Phrases */}
      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-2"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Emergency Japanese Phrases</p>
        {EMERGENCY_PHRASES.map(p => (
          <div key={p.jp} className="p-3 mb-2 rounded-xl"
            style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="font-jp text-white text-sm">{p.jp}</p>
            <p className="font-mono text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.rom}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.en}</p>
          </div>
        ))}
      </div>

      {/* Documents Checklist */}
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.35)' }}>Documents Checklist</p>
        {['Passport (valid 6+ months)', 'OU Student ID', 'Insurance Card (photo on phone)', 'Emergency Contact Card', 'Visa / COE Letter', 'Vaccination Records'].map((doc, i) => {
          const [checked, setChecked] = useState(i < 3)
          return (
            <button key={doc} onClick={() => setChecked(c => !c)}
              className="flex items-center gap-3 py-2.5 w-full text-left"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: checked ? 'rgba(91,138,94,0.3)' : 'rgba(255,255,255,0.06)', border: checked ? '1px solid #86efac' : '1px solid rgba(255,255,255,0.15)' }}>
                {checked && <IcCheck size={10} color="#86efac" strokeWidth={3} />}
              </div>
              <p className="text-xs" style={{ color: checked ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)', textDecoration: checked ? 'line-through' : 'none' }}>{doc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── SIM CARD PANEL ───────────────────────────────────────────────────────────
function SimPanel() {
  const SIM_OPTIONS = [
    { name: 'IIJmio eSIM', type: 'eSIM', data: '15GB', price: '¥3,740', days: 30, carrier: 'IIJ', best: true, pros: ['Instant activation', 'No physical card', 'Works with iPhone'], cons: ['Requires unlocked phone'] },
    { name: 'Sakura Mobile', type: 'Physical SIM', data: '30GB', price: '¥4,980', days: 30, carrier: 'SoftBank', pros: ['Pickup at airport', 'English support', 'Hotspot allowed'], cons: ['Need to pick up on arrival'] },
    { name: 'Mobal SIM', type: 'Physical SIM', data: 'Unlimited', price: '¥5,500', days: 30, carrier: 'NTT Docomo', pros: ['Best coverage', 'Truly unlimited', 'Pocket WiFi option'], cons: ['Most expensive'] },
    { name: 'Airalo eSIM', type: 'eSIM', data: '10GB', price: '$15 USD', days: 30, carrier: 'Multiple', pros: ['Buy before you go', 'Multiple countries', 'App-based'], cons: ['Smaller data cap'] },
  ]

  const WIFI_SPOTS = [
    { name: 'Starbucks Japan', icon: 'Starbucks', free: true },
    { name: 'McDonald\'s Japan', icon: null, free: true },
    { name: '7-Eleven Wi-Fi', icon: '', free: true },
    { name: 'JR Station Wi-Fi', icon: '', free: true },
    { name: 'Lawson Wi-Fi', icon: '', free: true },
    { name: 'Airport Free Wi-Fi', icon: '', free: true },
  ]

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl flex gap-2"
        style={{ background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.25)' }}>
        <IcPhone size={16} color="#818CF8" />
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Get a Japan SIM before or on arrival. eSIMs can be activated from the US. Physical SIMs available at major airports (Narita, Kansai, Haneda).
        </p>
      </div>

      {SIM_OPTIONS.map(sim => (
        <div key={sim.name} className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(18,18,20,0.95)', border: sim.best ? '1px solid rgba(224,36,36,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-display font-bold text-white text-sm">{sim.name}</h4>
                  {sim.best && <span className="badge badge-brand text-[9px]">⭐ Best Value</span>}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="badge badge-blue text-[9px]">{sim.type}</span>
                  <span className="badge badge-sakura text-[9px]">{sim.carrier}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-black text-white">{sim.price}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{sim.data} · {sim.days}d</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                {sim.pros.map(p => <p key={p} className="text-[10px] flex gap-1 items-center" style={{ color: '#86efac' }}><span>✓</span>{p}</p>)}
              </div>
              <div>
                {sim.cons.map(c => <p key={c} className="text-[10px] flex gap-1 items-center" style={{ color: '#F87171' }}><IcX size={9} color='#F87171' strokeWidth={2.5} />{c}</p>)}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-2"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Free Wi-Fi Spots in Japan</p>
        <div className="grid grid-cols-2 gap-2">
          {WIFI_SPOTS.map(w => (
            <div key={w.name} className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span>{w.icon}</span>
              <p className="text-xs font-display font-semibold text-white leading-tight">{w.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── FINANCE PANEL ────────────────────────────────────────────────────────────
function FinancePanel({ exchangeRate }) {
  const [jpyInput, setJpyInput] = useState('1000')
  const [usdInput, setUsdInput] = useState('')
  const [activeCalc, setActiveCalc] = useState('jpy')

  const usdVal = activeCalc === 'jpy' ? (parseFloat(jpyInput || 0) * exchangeRate).toFixed(2) : usdInput
  const jpyVal = activeCalc === 'usd' ? Math.round(parseFloat(usdInput || 0) / exchangeRate) : jpyInput

  const BUDGET_TEMPLATE = [
    { category: 'Meals (3×/day)', daily: 1500, icon: '', tip: 'Convenience stores for breakfast (¥300), ramen for lunch (¥800), set meal dinner (¥900)' },
    { category: 'Transit', daily: 400, icon: '', tip: 'IC card is most efficient. Day passes available in Kyoto (¥600)' },
    { category: 'Activities/Entry', daily: 500, icon: '', tip: 'Many shrines are free. Temple entries ~¥500. Plan 1-2 paid per day.' },
    { category: 'Shopping/Souvenirs', daily: 800, icon: '', tip: 'Set a weekly shopping budget. 100-yen stores are great for gifts.' },
    { category: 'Coffee/Snacks', daily: 300, icon: 'Starbucks', tip: 'Vending machines everywhere. 100-150 yen per drink.' },
    { category: 'Emergency Buffer', daily: 500, icon: null, tip: 'Always keep ¥2,000 cash on hand for emergencies.' },
  ]

  const JAPAN_TIPS = [
    { title: 'Cash is King', icon: '', desc: 'Japan is still very cash-heavy. Carry ¥5,000–10,000 at all times. Many small restaurants and shrines are cash-only.' },
    { title: 'IC Card Everything', icon: '', desc: 'Load your Suica with ¥5,000+ for transit. Also works at convenience stores, vending machines, and many restaurants.' },
    { title: 'Convenience Store Meals', icon: '', desc: 'Lawson, 7-Eleven, FamilyMart offer hot meals under ¥500. Onigiri (¥130), sandwiches, hot dogs, matcha desserts.' },
    { title: 'Set Meals (定食)', icon: null, desc: 'Teishoku (set meals) include rice, miso, protein for ¥700–1,200. Best value sit-down meal in Japan.' },
    { title: 'Gyudon Chains', icon: null, desc: 'Yoshinoya, Sukiya, Matsuya — beef bowls from ¥400. Open 24/7. No Japanese needed — just point at menu photos.' },
    { title: 'Happy Hour', icon: null, desc: 'Izakayas (Japanese pubs) often have 2-hour all-you-can-drink from ¥1,500. Great for group nights.' },
  ]

  const STUDY_TIPS = [
    { icon: null, title: 'Document Everything', desc: 'Your photos, receipts, and experiences are also your academic portfolio. Use the Photo Reel below.' },
    { icon: null, title: 'Talk to Locals', desc: 'Your professors set up guest lectures — ask for contact info. A business connection in Japan is invaluable.' },
    { icon: null, title: 'Keep a Field Journal', desc: 'Both MKT courses require site visit reports. Take notes immediately after every visit while details are fresh.' },
    { icon: null, title: 'Social Media for MKT 3513', desc: 'Document Japanese brand strategies, ad campaigns, and social media you see IRL. It\'s literal coursework!' },
    { icon: null, title: 'Network with Japanese Students', desc: 'Ritsumeikan has international students who may become future business contacts. Exchange LINE IDs.' },
    { icon: null, title: 'Plan Buffer Days', desc: 'Don\'t over-schedule. Some of the best study abroad moments are spontaneous. Leave 2-3 free afternoons per city.' },
  ]

  return (
    <div className="space-y-5">
      {/* Currency Calculator */}
      <div className="p-5 rounded-3xl"
        style={{ background: 'rgba(18,18,20,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-4"
          style={{ color: 'rgba(255,255,255,0.35)' }}>Currency Calculator</p>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-jp text-sm text-white">¥</span>
              <p className="text-[10px] font-display font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>Japanese Yen</p>
            </div>
            <input value={jpyInput} onChange={e => { setJpyInput(e.target.value); setActiveCalc('jpy') }}
              type="number" className="input-field text-xl font-display font-black" placeholder="1000" />
          </div>
          <div className="flex items-center justify-center">
            <div className="px-4 py-2 rounded-full font-mono text-sm"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#86efac' }}>
              1 USD = ¥{(1 / exchangeRate).toFixed(0)} · 1 JPY = ${exchangeRate.toFixed(4)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm text-white">$</span>
              <p className="text-[10px] font-display font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>US Dollars</p>
            </div>
            <input value={activeCalc === 'jpy' ? usdVal : usdInput}
              onChange={e => { setUsdInput(e.target.value); setActiveCalc('usd') }}
              type="number" className="input-field text-xl font-display font-black" placeholder="6.70" />
          </div>
          {jpyInput && <div className="text-center p-3 rounded-xl"
            style={{ background: 'rgba(224,36,36,0.1)', border: '1px solid rgba(224,36,36,0.2)' }}>
            <p className="font-display font-black text-white">¥{parseInt(jpyVal||0).toLocaleString()} = ${parseFloat(usdVal||0).toFixed(2)}</p>
          </div>}
        </div>
      </div>

      {/* Daily Budget Template */}
      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Recommended Daily Budget Template</p>
        {BUDGET_TEMPLATE.map(b => (
          <div key={b.category} className="mb-2 p-4 rounded-2xl"
            style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-base">{b.icon}</span>
                <p className="font-display font-bold text-white text-xs">{b.category}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-black text-white text-sm">¥{b.daily.toLocaleString()}</p>
                <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>${(b.daily * exchangeRate).toFixed(2)}</p>
              </div>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{b.tip}</p>
          </div>
        ))}
        <div className="p-4 rounded-2xl flex justify-between items-center"
          style={{ background: 'rgba(224,36,36,0.12)', border: '1px solid rgba(224,36,36,0.25)' }}>
          <p className="font-display font-bold text-white">Total Daily Budget</p>
          <div className="text-right">
            <p className="font-display font-black text-gradient text-lg">
              ¥{BUDGET_TEMPLATE.reduce((s,b)=>s+b.daily,0).toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              ≈ ${(BUDGET_TEMPLATE.reduce((s,b)=>s+b.daily,0) * exchangeRate).toFixed(2)}/day
            </p>
          </div>
        </div>
      </div>

      {/* Japan Spending Tips */}
      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>How to Spend Smart in Japan</p>
        {JAPAN_TIPS.map(t => (
          <div key={t.title} className="flex gap-3 p-4 mb-2 rounded-2xl"
            style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-2xl flex-shrink-0">{t.icon}</span>
            <div>
              <p className="font-display font-bold text-white text-sm mb-1">{t.title}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Study Abroad Tips */}
      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Making the Most of Your Study Abroad</p>
        {STUDY_TIPS.map(t => (
          <div key={t.title} className="flex gap-3 p-4 mb-2 rounded-2xl"
            style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(79,70,229,0.15)' }}>
            <span className="text-2xl flex-shrink-0">{t.icon}</span>
            <div>
              <p className="font-display font-bold text-white text-sm mb-1">{t.title}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── PHOTO REEL PANEL ─────────────────────────────────────────────────────────
function PhotoReelPanel() {
  const fileRef = useRef(null)
  const [photos, setPhotos] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?w=400&q=80', caption: 'Senso-ji Temple', city: 'Tokyo', date: 'Day 1' },
    { id: 2, url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80', caption: 'Kyoto Street', city: 'Kyoto', date: 'Day 12' },
    { id: 3, url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&q=80', caption: 'Ramen Dinner', city: 'Ibaraki', date: 'Day 3' },
    { id: 4, url: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=400&q=80', caption: 'Tea Ceremony', city: 'Kyoto', date: 'Day 14' },
    { id: 5, url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=400&q=80', caption: 'Hiking Day', city: 'Osaka', date: 'Day 8' },
    { id: 6, url: 'https://images.unsplash.com/photo-1578469645742-46cae010e5d4?w=400&q=80', caption: 'Kyoto Hotel View', city: 'Kyoto', date: 'Day 13' },
  ])
  const [playing, setPlaying] = useState(false)
  const [slideIdx, setSlideIdx] = useState(0)
  const [caption, setCaption] = useState('')
  const intervalRef = useRef(null)

  const addPhoto = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      setPhotos(prev => [...prev, { id: Date.now() + Math.random(), url, caption: file.name.split('.')[0], city: 'Japan', date: `Day ${prev.length + 1}` }])
    })
    toast.success(`${files.length} photo${files.length > 1 ? 's' : ''} added to your reel!`)
  }

  const startReel = () => {
    setPlaying(true)
    setSlideIdx(0)
    intervalRef.current = setInterval(() => {
      setSlideIdx(i => {
        if (i >= photos.length - 1) { clearInterval(intervalRef.current); setPlaying(false); return 0 }
        return i + 1
      })
    }, 2200)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl flex gap-2"
        style={{ background: 'rgba(255,183,197,0.1)', border: '1px solid rgba(255,183,197,0.2)' }}>
        <IcPlay size={20} color='#FFB7C5' />
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Add your trip photos and generate a <strong className="text-white">cinematic reel</strong>. Your memories, compiled and ready to share.
        </p>
      </div>

      {/* Cinematic Player */}
      {playing ? (
        <AnimatePresence mode="wait">
          <motion.div key={slideIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="relative rounded-3xl overflow-hidden"
            style={{ aspectRatio: '4/3' }}>
            <img src={photos[slideIdx]?.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-display font-black text-white text-xl">{photos[slideIdx]?.caption}</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                 {photos[slideIdx]?.city} · {photos[slideIdx]?.date}
              </p>
              <div className="flex gap-1 mt-3">
                {photos.map((_, i) => (
                  <div key={i} className="flex-1 h-0.5 rounded-full"
                    style={{ background: i <= slideIdx ? '#E02424' : 'rgba(255,255,255,0.3)' }} />
                ))}
              </div>
            </div>
            <button onClick={() => { clearInterval(intervalRef.current); setPlaying(false) }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
              <span className="text-white text-sm">×</span>
            </button>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div>
          {/* Photo Grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {photos.map((photo, i) => (
              <div key={photo.id} className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '1' }}>
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                <p className="absolute bottom-1 left-1 right-1 text-[8px] font-display font-bold text-white leading-tight truncate">
                  {photo.caption}
                </p>
              </div>
            ))}
            {/* Add Photo */}
            <button onClick={() => fileRef.current?.click()}
              className="rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
              style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.06)', border: '2px dashed rgba(255,255,255,0.15)' }}>
              <span className="text-2xl">+</span>
              <span className="text-[9px] font-display font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>Add Photo</span>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addPhoto} />
        </div>
      )}

      {/* Controls */}
      {!playing && (
        <div className="space-y-2">
          <button onClick={startReel}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #E02424, #FF8E53)', boxShadow: '0 8px 24px rgba(224,36,36,0.35)' }}>
            <span className="text-xl">▶</span>
            <div className="text-left">
              <p className="font-display font-black text-white">Play Cinematic Reel</p>
              <p className="text-xs text-white/70">{photos.length} photos · Auto slideshow</p>
            </div>
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => fileRef.current?.click()}
              className="py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span></span>
              <span className="font-display font-bold text-white text-xs">Add Photos</span>
            </button>
            <button onClick={() => toast.success('Export feature coming soon!')}
              className="py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ background: 'rgba(255,183,197,0.12)', border: '1px solid rgba(255,183,197,0.2)' }}>
              <IcArrow dir='up' size={16} color='white' strokeWidth={2} />
              <span className="font-display font-bold text-white text-xs">Export Reel</span>
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Photos', val: photos.length, icon: 'cam' },
          { label: 'Cities', val: new Set(photos.map(p => p.city)).size, icon: '' },
          { label: 'Days', val: photos.length, icon: 'cal' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-2xl text-center"
            style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="mb-0.5 flex justify-center">
                  {s.icon==='cam'&&<IcCamera size={18} color="rgba(255,255,255,0.5)"/>}
                  {s.icon==='cal'&&<IcPin size={18} color="rgba(255,255,255,0.5)"/>}
                  {s.icon==='trophy'&&<IcTrophy size={18} color="rgba(255,255,255,0.5)"/>}
                  {s.icon==='pin'&&<IcPin size={18} color="rgba(255,255,255,0.5)"/>}
                  {s.icon==='star'&&<IcStar size={18} color="rgba(255,255,255,0.5)"/>}
                </div>
            <p className="font-display font-black text-white text-lg">{s.val}</p>
            <p className="text-[9px] font-display uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN PROFILE VIEW ────────────────────────────────────────────────────────
const PROFILE_SECTIONS = [
  { key: 'wallet',  label: 'Wallet',  icon: 'wallet' },
  { key: 'health',  label: 'Health',  icon: '' },
  { key: 'sim',     label: 'SIM',     icon: 'sim' },
  { key: 'finance', label: 'Finance', icon: 'money' },
  { key: 'reel',    label: 'Reel',    icon: 'reel' },
]

export default function ProfileView() {
  const { user, exchangeRate, completedQuests, quests, setUser, theme } = useStore()
  const t = getTheme(theme)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeSection, setActiveSection] = useState(null)

  const handleAuth = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleSignOut = () => {
    setIsLoggedIn(false)
    setActiveSection(null)
    toast.success('Signed out. See you next time!')
  }

  if (!isLoggedIn) return <AuthScreen onAuth={handleAuth} />

  // If a section is open, show it full-screen within the scroll area
  if (activeSection) {
    return (
      <div className="px-5 pb-6 space-y-4">
        <button onClick={() => setActiveSection(null)}
          className="flex items-center gap-2 active:opacity-70 transition-opacity">
          <span className="text-sm" style={{ color: '#E02424' }}>←</span>
          <span className="font-display font-bold text-white text-sm">Back to Profile</span>
        </button>
        {activeSection === 'wallet'  && <WalletPanel exchangeRate={exchangeRate} />}
        {activeSection === 'health'  && <HealthPanel />}
        {activeSection === 'sim'     && <SimPanel />}
        {activeSection === 'finance' && <FinancePanel exchangeRate={exchangeRate} />}
        {activeSection === 'reel'    && <PhotoReelPanel />}
      </div>
    )
  }

  return (
    <div className="px-5 pb-6 space-y-5">

      {/* ── Profile Card ─────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(224,36,36,0.12) 0%, rgba(18,18,20,0.97) 100%)', border: '1px solid rgba(224,36,36,0.2)' }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(224,36,36,0.15)' }} />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full p-[2px] flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #E02424, #FF8E53)', boxShadow: '0 0 20px rgba(224,36,36,0.4)' }}>
            <img src={user.avatarUrl} alt={user.name}
              className="w-full h-full rounded-full object-cover" style={{ border: '2px solid #09090b' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-black text-white text-xl truncate" style={{ letterSpacing: '-0.02em' }}>
              {user.name}
            </h2>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {user.email || 'ou.edu'}
            </p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="badge badge-brand text-[9px]">★ {user.points?.toLocaleString()} pts</span>
              <span className="badge badge-sakura text-[9px]">JP Study Abroad</span>
            </div>
          </div>
        </div>

        {/* School info */}
        <div className="mt-4 pt-4 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            {/* OU Logo placeholder */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-white text-sm flex-shrink-0"
              style={{ background: '#841617', border: '2px solid rgba(255,255,255,0.15)' }}>OU</div>
            <div>
              <p className="font-display font-bold text-white text-sm">{user.university || 'University of Oklahoma'}</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {user.major || 'Marketing'} · {user.year || 'Junior'} · Class of 2026
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: 'Program', val: '2 Courses' },
              { label: 'Class Size', val: '~25 Students' },
              { label: 'Trip Length', val: '24 Nights' },
            ].map(s => (
              <div key={s.label} className="text-center p-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="font-display font-black text-white text-sm">{s.val}</p>
                <p className="text-[9px] font-display uppercase tracking-wider mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Quick Stats ──────────────────────── */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Quests', val: completedQuests.size, icon: 'trophy' },
          { label: 'Points', val: user.points > 999 ? `${(user.points/1000).toFixed(1)}k` : user.points, icon: '⭐' },
          { label: 'Days Left', val: '18', icon: 'cal' },
          { label: 'City', val: 'Ibaraki', icon: '' },
        ].map(s => (
          <div key={s.label} className="p-2.5 rounded-2xl text-center"
            style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="mb-0.5 flex justify-center">
            {s.icon==='trophy'&&<IcTrophy size={16} color="rgba(255,255,255,0.4)"/>}
            {s.icon==='star'&&<IcStar size={16} color="rgba(255,255,255,0.4)"/>}
            {s.icon==='cal'&&<IcPin size={16} color="rgba(255,255,255,0.4)"/>}
            {s.icon==='pin'&&<IcPin size={16} color="rgba(255,255,255,0.4)"/>}
          </div>
            <p className="font-display font-black text-white text-sm">{s.val}</p>
            <p className="text-[8px] font-display uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Feature Sections Grid ─────────────── */}
      <div>
        <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Student Tools</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'wallet', icon: null, title: 'Wallet & ATM', desc: 'Suica, Apple/Google Pay, nearby ATMs', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)' },
            { key: 'health', icon: '', title: 'Health & Safety', desc: 'Hospitals, allergies, emergency docs', color: '#F87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)' },
            { key: 'sim',    icon: null, title: 'SIM & Data', desc: 'eSIM options, Wi-Fi spots, carriers', color: '#818CF8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.25)' },
            { key: 'finance',icon: null, title: 'Finance & Tips', desc: 'Budget template, spending guide, converter', color: '#86efac', bg: 'rgba(134,239,172,0.12)', border: 'rgba(134,239,172,0.25)' },
            { key: 'reel',   icon: null, title: 'Photo Reel', desc: 'Cinematic trip montage & memories', color: '#FFB7C5', bg: 'rgba(255,183,197,0.12)', border: 'rgba(255,183,197,0.25)', full: true },
          ].map(section => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`p-4 rounded-2xl text-left flex flex-col gap-2 active:scale-95 transition-all ${section.full ? 'col-span-2 flex-row items-center' : ''}`}
              style={{ background: section.bg, border: `1px solid ${section.border}` }}
            >
              <div className="mb-0.5">
              {section.icon==='wallet'&&<IcWallet size={22} color={section.color}/>}
              {section.icon==='sim'&&<IcPhone size={22} color={section.color}/>}
              {section.icon==='money'&&<IcMoney size={22} color={section.color}/>}
              {section.icon==='reel'&&<IcPlay size={22} color={section.color}/>}
              {section.icon==='health'&&<IcHeart size={22} color={section.color}/>}
            </div>
              <div>
                <p className="font-display font-bold text-white text-sm">{section.title}</p>
                <p className="text-[10px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>{section.desc}</p>
              </div>
              <span className="ml-auto text-xs font-display font-bold" style={{ color: section.color }}>→</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Sign Out ─────────────────────────── */}
      <button onClick={handleSignOut}
        className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        style={{ background: 'rgba(224,36,36,0.08)', border: '1px solid rgba(224,36,36,0.2)' }}>
        <span className="font-display font-bold text-sm" style={{ color: '#F87171' }}>Sign Out</span>
      </button>

      <div className="text-center pb-2">
        <p className="font-display font-black text-gradient">OUStudyJapan</p>
        <p className="text-[10px] font-display mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
          v2.0 · Made for OU Students 
        </p>
      </div>
    </div>
  )
}
