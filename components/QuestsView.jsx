// components/QuestsView.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { IcStar, IcTrophy, IcTorii, IcMap, IcBook, IcArrow, IcCheck, IcPin, IcGlobe } from './ui/Icons'
import { useState } from 'react'
import useStore from '../utils/store'
import toast from 'react-hot-toast'

const DIFFICULTY_CONFIG = {
  easy: { color: '#86efac', bg: 'rgba(91,138,94,0.15)', border: 'rgba(91,138,94,0.3)', label: 'Easy' },
  medium: { color: '#FCD34D', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)', label: 'Medium' },
  hard: { color: '#F87171', bg: 'rgba(224,36,36,0.15)', border: 'rgba(224,36,36,0.3)', label: 'Hard' },
}

// OU Program activities — always available
const PROGRAM_ACTIVITIES = [
  {
    id: 'act-kyoto-orientation',
    title: 'Kyoto Orientation Tour',
    title_jp: '京都オリエンテーションツアー',
    description: 'Guided orientation tour through Kyoto\'s historic districts. Get familiar with the city layout, transit system, and key landmarks.',
    category: 'Program',
    points: 150,
    city: 'Kyoto',
    difficulty: 'easy',
    isRequired: true,
    image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'act-tokyo-orientation',
    title: 'Tokyo Orientation Tour',
    title_jp: '東京オリエンテーションツアー',
    description: 'Guided orientation tour through central Tokyo. Covers transit navigation, neighborhood overview, and safety briefing.',
    category: 'Program',
    points: 150,
    city: 'Tokyo',
    difficulty: 'easy',
    isRequired: true,
    image_url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'act-tea-ceremony',
    title: 'Tea Ceremony Experience',
    title_jp: '茶道体験',
    description: 'Participate in a traditional Japanese tea ceremony (chado). Learn the philosophy of harmony, respect, purity, and tranquility.',
    category: 'Culture',
    points: 300,
    city: 'Kyoto',
    difficulty: 'easy',
    isRequired: true,
    image_url: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'act-temples',
    title: 'Temple & Shrine Visits',
    title_jp: '寺院・神社参拝',
    description: 'Visit iconic temples and shrines including Kinkaku-ji (Golden Pavilion), Fushimi Inari, and Senso-ji. Learn about Shinto and Buddhist traditions.',
    category: 'Culture',
    points: 400,
    city: 'Multiple Cities',
    difficulty: 'easy',
    isRequired: true,
    image_url: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'act-business-visit',
    title: 'Japanese Business Site Visit',
    title_jp: 'ビジネス見学',
    description: 'Visit a Japanese company or business district as part of the MKT 3013 curriculum. Apply marketing and SCM concepts in a real-world Japanese business context.',
    category: 'Academic',
    points: 500,
    city: 'Osaka/Tokyo',
    difficulty: 'medium',
    isRequired: true,
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'act-guest-lecture',
    title: 'Guest Lecturer Session',
    title_jp: 'ゲスト講義',
    description: 'Attend a guest lecture from a Japanese marketing or business professional. Ties directly into both MKT 3013 and MKT 3513 coursework.',
    category: 'Academic',
    points: 250,
    city: 'Ibaraki',
    difficulty: 'easy',
    isRequired: true,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
  },
]

const EXCURSIONS = [
  {
    id: 'exc-ibaraki',
    location: 'Ibaraki City, Osaka Prefecture',
    nights: 10,
    emoji: null, cityCode: 'IBR',
    color: '#E02424',
    highlights: ['Ritsumeikan OIC Campus', 'Osaka day trips', 'Dotonbori nightlife nearby', 'Arima Onsen accessible'],
  },
  {
    id: 'exc-kyoto',
    location: 'Kyoto',
    nights: 11,
    emoji: null, cityCode: 'KYO',
    color: '#4F46E5',
    highlights: ['1,600+ temples & shrines', 'Bamboo Forest (Arashiyama)', 'Nishiki Street Market', 'Gion traditional district'],
  },
  {
    id: 'exc-tokyo',
    location: 'Tokyo',
    nights: 3,
    emoji: null, cityCode: 'TYO',
    color: '#10B981',
    highlights: ['Shibuya Crossing', 'Tsukiji Outer Market', 'Akihabara electronics', 'teamLab digital art'],
  },
]

function QuestCard({ quest, isCompleted, onComplete }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const diff = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.easy

  const cityColors = {
    Kyoto: '#4F46E5',
    Tokyo: '#10B981',
    Ibaraki: '#E02424',
    'Multiple Cities': '#FFB7C5',
    'Osaka/Tokyo': '#FCD34D',
  }

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: isCompleted ? 'rgba(91,138,94,0.08)' : 'rgba(18,18,20,0.95)',
        border: isCompleted ? '1px solid rgba(91,138,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
        opacity: isCompleted ? 0.8 : 1,
      }}
    >
      <button
        className="w-full text-left active:opacity-80 transition-opacity"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="relative h-36">
          <img src={quest.image_url} alt={quest.title}
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ filter: isCompleted ? 'grayscale(50%)' : 'none' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />

          {/* Badges overlay */}
          {quest.isRequired && (
            <div className="absolute top-3 left-3">
              <span className="badge badge-brand" style={{fontSize:"9px"}}>Required</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div>
              <h4 className="font-display font-bold text-white text-sm leading-tight">{quest.title}</h4>
              {quest.title_jp && (
                <p className="font-jp text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {quest.title_jp}
                </p>
              )}
            </div>
            {isCompleted ? (
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(91,138,94,0.3)', border: '2px solid #86efac' }}>
                <IcCheck size={11} color="#86efac" strokeWidth={2.8} />
              </div>
            ) : (
              <div className="px-2.5 py-1.5 rounded-full"
                style={{ background: 'rgba(224,36,36,0.25)', border: '1px solid rgba(224,36,36,0.4)' }}>
                <span className="text-xs font-display font-black text-white">{quest.points} pts</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-3 flex items-center gap-2">
          <span className="badge text-[9px]"
            style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
            {diff.label}
          </span>
          <span className="badge badge-sakura text-[9px]">{quest.category}</span>
          {quest.city && (
            <span className="badge text-[9px]"
              style={{
                background: `${cityColors[quest.city] || '#FFB7C5'}18`,
                color: cityColors[quest.city] || '#FFB7C5',
                border: `1px solid ${cityColors[quest.city] || '#FFB7C5'}35`,
              }}>
              {quest.city}
            </span>
          )}
          <span className="ml-auto text-xs font-display" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs leading-relaxed mt-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {quest.description}
              </p>
              {!isCompleted && (
                <button
                  onClick={(e) => { e.stopPropagation(); onComplete(quest) }}
                  className="w-full mt-4 btn-primary text-sm"
                >
                  Mark Complete · +{quest.points} pts
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function QuestsView() {
  const { quests, completedQuests, completeQuest } = useStore()
  const [tab, setTab] = useState('explore') // explore | program | excursions

  const allQuests = [...quests, ...PROGRAM_ACTIVITIES]
  const totalPossible = allQuests.reduce((s, q) => s + q.points, 0)
  const earnedPoints = [...completedQuests].reduce((sum, id) => {
    const q = allQuests.find(q => q.id === id)
    return sum + (q?.points || 0)
  }, 0)
  const progressPct = totalPossible > 0 ? (earnedPoints / totalPossible) * 100 : 0

  const handleComplete = (quest) => {
    if (completedQuests.has(quest.id)) return
    completeQuest(quest.id, quest.points)
    toast.success(`+${quest.points} pts — Quest Complete!`, {
      style: { background: '#18181b', color: 'white', border: '1px solid rgba(224,36,36,0.3)', fontFamily: 'Syne,sans-serif', fontWeight: 700 },
    })
  }

  const exploreQuests = quests
  const programQuests = PROGRAM_ACTIVITIES

  const TABS = [
    { key: 'explore', label: 'Explore', count: exploreQuests.length },
    { key: 'program', label: 'Program', count: programQuests.length },
    { key: 'excursions', label: 'Itinerary', count: EXCURSIONS.length },
  ]

  return (
    <div className="px-5 pb-6 space-y-5">

      {/* ── Progress Header ──────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,183,197,0.1) 0%, rgba(18,18,20,0.97) 100%)',
          border: '1px solid rgba(255,183,197,0.2)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-display font-bold uppercase tracking-widest mb-1" style={{ color: '#FFB7C5' }}>
              Explorer Progress
            </p>
            <p className="text-2xl font-display font-black text-white">
              {completedQuests.size} / {allQuests.length} Complete
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,183,197,0.12)', border: '1px solid rgba(255,183,197,0.2)' }}>
            <IcTrophy size={24} color="#FFB7C5" />
          </div>
        </div>
        <div className="progress-bar">
          <motion.div className="progress-fill"
            initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: 'linear-gradient(to right, #FFB7C5, #E02424)' }} />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs font-display font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {earnedPoints.toLocaleString()} pts earned
          </p>
          <p className="text-xs font-display font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {(totalPossible - earnedPoints).toLocaleString()} remaining
          </p>
        </div>
      </motion.div>

      {/* ── Tabs ─────────────────────────────── */}
      <div className="flex gap-1.5 p-1.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 py-2 rounded-xl text-[10px] font-display font-bold transition-all active:scale-95"
            style={{
              background: tab === t.key ? '#E02424' : 'transparent',
              color: tab === t.key ? 'white' : 'rgba(255,255,255,0.4)',
            }}
          >
            {t.label}
            <span className="ml-1 opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* ── Explore Quests ───────────────────── */}
      {tab === 'explore' && (
        <div className="space-y-4">
          {exploreQuests.map((quest, i) => (
            <motion.div key={quest.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}>
              <QuestCard
                quest={quest}
                isCompleted={completedQuests.has(quest.id)}
                onComplete={handleComplete}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Program Activities ───────────────── */}
      {tab === 'program' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl flex gap-2"
            style={{ background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.25)' }}>
            <IcBook size={16} color="#818CF8" />
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              These activities are <strong className="text-white">included with your program</strong> and complement MKT 3013 and MKT 3513. Mark each as complete to earn points.
            </p>
          </div>

          {programQuests.map((quest, i) => (
            <motion.div key={quest.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}>
              <QuestCard
                quest={quest}
                isCompleted={completedQuests.has(quest.id)}
                onComplete={handleComplete}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Excursions / Itinerary ───────────── */}
      {tab === 'excursions' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl"
            style={{ background: 'rgba(255,183,197,0.08)', border: '1px solid rgba(255,183,197,0.2)' }}>
            <p className="text-xs font-display font-bold text-white mb-1">Your 24-Night Journey</p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              All excursions are included in your program fee. No additional cost.
            </p>
          </div>

          {EXCURSIONS.map((exc, i) => (
            <motion.div key={exc.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: 'rgba(18,18,20,0.95)', border: `1px solid ${exc.color}30` }}
            >
              {/* Header */}
              <div className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${exc.color}20`, border: `1px solid ${exc.color}40` }}>
                  {exc.cityCode}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-black text-white text-base">{exc.location}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge text-[9px]"
                      style={{ background: `${exc.color}18`, color: exc.color, border: `1px solid ${exc.color}40` }}>
                      {exc.nights} nights
                    </span>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="px-5 pb-5">
                <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-2.5"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>Highlights</p>
                {exc.highlights.map(h => (
                  <div key={h} className="flex items-center gap-2.5 py-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-xs font-bold" style={{ color: exc.color }}>—</span>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{h}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Standard Activities Summary */}
          <div className="p-4 rounded-2xl"
            style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-3"
              style={{ color: 'rgba(255,255,255,0.3)' }}>Standard Included Activities</p>
            {[
              { icon: null, text: 'Orientation tours in Kyoto and Tokyo' },
              { icon: null, text: 'Tea ceremony experience' },
              { icon: null, text: 'Visits to temples and shrines' },
              { icon: null, text: 'Business site visits (MKT 3013)' },
              { icon: null, text: 'Guest lecturers (MKT 3013 & MKT 3513)' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
