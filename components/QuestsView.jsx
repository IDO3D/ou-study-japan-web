// components/QuestsView.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { IcStar, IcTrophy, IcTorii, IcMap, IcBook, IcArrow, IcCheck, IcPin, IcGlobe } from './ui/Icons'
import { useState } from 'react'
import useStore from '../utils/store'
import toast from 'react-hot-toast'

const DIFFICULTY_CONFIG = {
  easy: { color: 'var(--brand)', bg: 'rgba(224, 36, 36, 0.1)', border: 'rgba(224, 36, 36, 0.2)', label: 'Easy' },
  medium: { color: '#D97706', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', label: 'Medium' },
  hard: { color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)', border: 'rgba(220, 38, 38, 0.2)', label: 'Hard' },
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
    location: 'Ibaraki City',
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

function QuestCard({ quest, isCompleted, onComplete, index }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const diff = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.easy

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
      className="rounded-[1.5rem] overflow-hidden border shadow-sm transition-all"
      style={{
        background: isCompleted ? 'var(--surface2)' : 'var(--surface)',
        borderColor: isCompleted ? 'rgba(91, 138, 94, 0.3)' : 'var(--border)',
        opacity: isCompleted ? 0.7 : 1,
      }}
    >
      <button
        className="w-full text-left active:scale-[0.98] transition-transform"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="relative h-44">
          <img src={quest.image_url} alt={quest.title}
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ filter: isCompleted ? 'grayscale(80%)' : 'none' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />

          {/* Badges overlay */}
          {quest.isRequired && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-full font-display font-bold text-[10px] text-white shadow-sm backdrop-blur-md"
                style={{ background: 'rgba(224, 36, 36, 0.85)', border: '1px solid rgba(255,255,255,0.1)' }}>REQUIRED</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
            <div>
              <h4 className="font-display font-black text-white text-base leading-tight drop-shadow-md">{quest.title}</h4>
              {quest.title_jp && (
                <p className="font-jp text-[11px] mt-1 font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {quest.title_jp}
                </p>
              )}
            </div>
            {isCompleted ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md"
                style={{ background: 'rgba(91,138,94,0.4)', border: '2px solid #86efac' }}>
                <IcCheck size={16} color="#86efac" strokeWidth={2.8} />
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md"
                style={{ background: 'rgba(224,36,36,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <span className="text-sm font-display font-black text-white">{quest.points} pts</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3.5 flex items-center gap-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="px-2 py-1 rounded-md text-[10px] font-bold"
            style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
            {diff.label}
          </span>
          <span className="px-2 py-1 rounded-md text-[10px] font-bold" style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}>{quest.category}</span>
          {quest.city && (
            <span className="px-2 py-1 rounded-md text-[10px] font-bold" style={{ background: 'var(--surface2)', color: 'var(--brand)' }}>
              {quest.city}
            </span>
          )}
          <span className="ml-auto text-sm font-display font-bold" style={{ color: 'var(--text-muted)' }}>
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
            <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {quest.description}
              </p>
              {!isCompleted && (
                <button
                  onClick={(e) => { e.stopPropagation(); onComplete(quest) }}
                  className="w-full mt-5 py-3.5 rounded-xl font-display font-bold text-sm text-white shadow-lg active:scale-[0.98] transition-all"
                  style={{ background: 'var(--brand)' }}
                >
                  Mark Complete · +{quest.points} pts
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
      style: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', fontFamily: 'Syne,sans-serif', fontWeight: 700 },
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
    <div className="min-h-full pb-20 pt-2" style={{ background: 'var(--bg)' }}>
      {/* ── Progress Header (Apple Wallet Style) ──────────────────── */}
      <div className="px-5 pb-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[1.5rem] shadow-xl relative overflow-hidden"
          style={{ background: 'var(--surface)' }}
        >
          {/* subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full" style={{ background: 'var(--brand)', opacity: 0.15, transform: 'translate(30%, -30%)' }} />

          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <p className="text-[10px] font-display font-black uppercase tracking-widest mb-1.5" style={{ color: 'var(--brand)' }}>
                Explorer Progress
              </p>
              <p className="text-3xl font-display font-black leading-none" style={{ color: 'var(--text)' }}>
                {completedQuests.size} <span className="text-lg" style={{ color: 'var(--text-muted)' }}>/ {allQuests.length}</span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <IcTrophy size={24} color="var(--brand)" />
            </div>
          </div>
          <div className="h-3 rounded-full overflow-hidden mb-2 relative z-10" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
            <motion.div className="h-full rounded-full"
              initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: 'var(--brand)' }} />
          </div>
          <div className="flex justify-between relative z-10">
            <p className="text-xs font-display font-bold" style={{ color: 'var(--text-muted)' }}>
              {earnedPoints.toLocaleString()} pts earned
            </p>
            <p className="text-xs font-display font-bold" style={{ color: 'var(--text-muted)' }}>
              {(totalPossible - earnedPoints).toLocaleString()} remaining
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Frosted Sticky Tabs ─────────────────────────────── */}
      <div className="sticky top-0 z-20 px-5 pt-2 pb-4 backdrop-blur-md" style={{ background: 'linear-gradient(to bottom, var(--bg) 60%, transparent 100%)' }}>
        <div className="flex gap-2 p-1.5 rounded-2xl border shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 py-2.5 rounded-xl text-xs font-display font-black transition-all active:scale-[0.98]"
              style={{
                background: tab === t.key ? 'var(--text)' : 'transparent',
                color: tab === t.key ? 'var(--bg)' : 'var(--text-muted)',
              }}
            >
              {t.label}
              <span className="ml-1.5 opacity-60">({t.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ───────────────────── */}
      <div className="px-5">
        {/* Explore Quests */}
        {tab === 'explore' && (
          <div className="space-y-5">
            {exploreQuests.map((quest, i) => (
              <QuestCard
                key={quest.id}
                index={i}
                quest={quest}
                isCompleted={completedQuests.has(quest.id)}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}

        {/* Program Quests */}
        {tab === 'program' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl flex gap-3 border shadow-sm"
              style={{ background: 'var(--brand-glow)', borderColor: 'var(--brand)' }}>
              <div className="mt-0.5"><IcBook size={18} color="var(--brand)" /></div>
              <p className="text-sm font-body leading-relaxed m-0" style={{ color: 'var(--brand)' }}>
                These activities are <strong>included with your program</strong> and complement MKT 3013 and MKT 3513. Mark each as complete to earn points.
              </p>
            </div>

            {programQuests.map((quest, i) => (
              <QuestCard
                key={quest.id}
                index={i}
                quest={quest}
                isCompleted={completedQuests.has(quest.id)}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}

        {/* Excursions */}
        {tab === 'excursions' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl border shadow-sm"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <p className="text-xs font-display font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--brand)' }}>Your 24-Night Journey</p>
              <p className="text-[13px] font-body m-0" style={{ color: 'var(--text-muted)' }}>
                All excursions are completely <strong style={{ color: 'var(--text)' }}>included in your program fee.</strong>
              </p>
            </div>

            {EXCURSIONS.map((exc, i) => (
              <motion.div key={exc.id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-[1.5rem] overflow-hidden border shadow-sm"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                {/* Header */}
                <div className="p-5 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-display font-black flex-shrink-0 border shadow-sm"
                    style={{ background: 'var(--surface2)', color: exc.color, borderColor: 'var(--border)' }}>
                    {exc.cityCode}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-black text-lg m-0 leading-tight" style={{ color: 'var(--text)' }}>{exc.location}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold"
                        style={{ background: 'var(--surface2)', color: exc.color, border: `1px solid var(--border)` }}>
                        {exc.nights} nights
                      </span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="px-5 pb-5">
                  <p className="text-[10px] font-display font-black uppercase tracking-widest mb-3"
                    style={{ color: 'var(--text-dim)' }}>Highlights</p>
                  {exc.highlights.map((h, idx) => (
                    <div key={h} className="flex items-center gap-3 py-2"
                      style={{ borderBottom: idx === exc.highlights.length - 1 ? 'none' : '1px solid var(--border)' }}>
                      <span className="text-xs font-bold" style={{ color: exc.color }}>—</span>
                      <p className="text-sm font-body m-0" style={{ color: 'var(--text)' }}>{h}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Standard Activities Summary */}
            <div className="p-5 rounded-[1.5rem] border shadow-sm mt-6"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-display font-black uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-dim)' }}>Standard Included Activities</p>
              {[
                { text: 'Orientation tours in Kyoto and Tokyo' },
                { text: 'Tea ceremony experience' },
                { text: 'Visits to temples and shrines' },
                { text: 'Business site visits (MKT 3013)' },
                { text: 'Guest lecturers (MKT 3013 & MKT 3513)' },
              ].map((item, idx) => (
                <div key={item.text} className="flex items-center gap-3 py-2.5"
                  style={{ borderBottom: idx === 4 ? 'none' : '1px solid var(--border)' }}>
                  <IcCheck size={14} color="var(--brand)" />
                  <p className="text-sm font-body m-0" style={{ color: 'var(--text)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
