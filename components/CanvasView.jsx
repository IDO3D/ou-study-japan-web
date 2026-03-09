// components/CanvasView.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IcCheck, IcAlert } from './ui/Icons'

const PROGRAM_COST = {
  tuition: 3072,       // 2 courses × 3 credit hours × ~$512/credit (OU rate example)
  programFee: 4200,    // study abroad program fee
  housing: 1800,       // OIC Seminar House + hotels (est.)
  airfare: 1100,       // estimated round-trip OKC → Japan
  meals: 900,          // daily allowance estimate
  excursions: 600,     // included activities
  total: 11672,
}

const COURSES = [
  {
    id: 'mkt3013',
    code: 'MKT 3013',
    title: 'Principles of Marketing & Supply Chain Management',
    shortTitle: 'Marketing & SCM',
    instructor: 'Qiong Wang, Ph.D.',
    credits: 3,
    grade: 'A',
    gradePoints: 4.0,
    gradePercent: 94,
    location: 'Ritsumeikan University — OIC Campus',
    locationNote: 'Ibaraki City, Osaka Prefecture',
    isOnline: false,
    color: '#E02424',
    colorBg: 'rgba(224,36,36,0.12)',
    colorBorder: 'rgba(224,36,36,0.25)',
    emoji: null,
    description: 'Foundational understanding of the intertwined disciplines of Marketing & Supply Chain Management — two critical components of modern business operations.',
    assignments: [
      { name: 'Business Site Visit Report', score: 96, total: 100, due: 'Week 3' },
      { name: 'Guest Lecture Reflection', score: 91, total: 100, due: 'Week 2' },
      { name: 'SCM Case Study', score: 94, total: 100, due: 'Week 4' },
      { name: 'Final Presentation', score: null, total: 100, due: 'Week 5' },
    ],
    prereq: 'Declared Business Major/Minor',
    features: ['On-site learning', 'Business site visits', 'Guest lecturers'],
  },
  {
    id: 'mkt3513',
    code: 'MKT 3513',
    title: 'Social Media Marketing',
    shortTitle: 'Social Media Mktg',
    instructor: 'Kim Gaddie, Ph.D.',
    credits: 3,
    grade: 'A-',
    gradePoints: 3.7,
    gradePercent: 91,
    location: 'Ritsumeikan University — OIC Campus',
    locationNote: 'Ibaraki City, Osaka Prefecture',
    isOnline: false,
    color: '#4F46E5',
    colorBg: 'rgba(79,70,229,0.12)',
    colorBorder: 'rgba(79,70,229,0.25)',
    emoji: null,
    description: 'Practical knowledge and insights to establish objectives and strategies, select social media platforms, and monitor and measure marketing results.',
    assignments: [
      { name: 'Platform Strategy Audit', score: 93, total: 100, due: 'Week 2' },
      { name: 'Japanese Brand Analysis', score: 88, total: 100, due: 'Week 3' },
      { name: 'Campaign Proposal', score: 92, total: 100, due: 'Week 4' },
      { name: 'Final Campaign Execution', score: null, total: 100, due: 'Week 5' },
    ],
    prereq: 'Declared Business Major/Minor',
    features: ['Live campaigns', 'Consumer research', 'Platform analytics'],
  },
]

function GradeRing({ percent, color }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const dash = (percent / 100) * circ
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
      <motion.circle
        cx="28" cy="28" r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        transform="rotate(-90 28 28)"
      />
    </svg>
  )
}

function AssignmentRow({ a }) {
  const done = a.score !== null
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
        style={{
          background: done ? 'rgba(91,138,94,0.2)' : 'rgba(255,255,255,0.06)',
          border: done ? '1px solid rgba(91,138,94,0.4)' : '1px solid rgba(255,255,255,0.1)',
          color: done ? '#86efac' : 'rgba(255,255,255,0.3)',
        }}
      >
        {done ? 'Done' : 'Open'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-display font-semibold text-white truncate">{a.name}</p>
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Due: {a.due}</p>
      </div>
      <div className="text-right flex-shrink-0">
        {done ? (
          <>
            <p className="text-sm font-display font-black text-white">{a.score}/{a.total}</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{a.score}%</p>
          </>
        ) : (
          <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.25)' }}>
            Upcoming
          </span>
        )}
      </div>
    </div>
  )
}

function CostBreakdown() {
  const items = [
    { label: 'Tuition (6 credit hrs)', amount: PROGRAM_COST.tuition, icon: '', color: '#818CF8' },
    { label: 'Program Fee', amount: PROGRAM_COST.programFee, icon: '', color: '#E02424' },
    { label: 'Housing (Hall + Hotels)', amount: PROGRAM_COST.housing, icon: null, color: '#FFB7C5' },
    { label: 'Round-Trip Airfare', amount: PROGRAM_COST.airfare, icon: '', color: '#60A5FA' },
    { label: 'Meals Allowance', amount: PROGRAM_COST.meals, icon: '', color: '#86efac' },
    { label: 'Excursions & Activities', amount: PROGRAM_COST.excursions, icon: null, color: '#FCD34D' },
  ]
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3 py-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          
          <p className="flex-1 text-xs font-display font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {item.label}
          </p>
          <p className="font-display font-black text-sm" style={{ color: item.color }}>
            ${item.amount.toLocaleString()}
          </p>
        </div>
      ))}
      <div className="flex items-center justify-between pt-3">
        <p className="font-display font-black text-white">Est. Total</p>
        <p className="font-display font-black text-xl text-gradient">${PROGRAM_COST.total.toLocaleString()}</p>
      </div>
      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
        * Estimates only. Verify exact costs with OU Education Abroad office.
      </p>
    </div>
  )
}

export default function CanvasView() {
  const [expandedId, setExpandedId] = useState(null)
  const [activeTab, setActiveTab] = useState('courses') // courses | cost

  const gpa = (COURSES.reduce((s, c) => s + c.gradePoints, 0) / COURSES.length).toFixed(2)

  return (
    <div className="px-5 pb-6 space-y-5">

      {/* ── Canvas Header ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-3xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(224,36,36,0.15) 0%, rgba(18,18,20,0.97) 70%)',
          border: '1px solid rgba(224,36,36,0.2)',
        }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl"
          style={{ background: 'rgba(224,36,36,0.15)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
              style={{ background: '#E02424' }}>C</div>
            <p className="text-xs font-display font-bold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              OU Canvas · Japan Program
            </p>
          </div>
          <h2 className="text-2xl font-display font-black text-white" style={{ letterSpacing: '-0.02em' }}>
            Marketing in Japan
          </h2>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Summer 2025 · Ritsumeikan University · OIC Campus
          </p>

          <div className="flex gap-4 mt-4">
            <div>
              <p className="text-2xl font-display font-black text-white">{gpa}</p>
              <p className="text-[10px] font-display font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.35)' }}>Program GPA</p>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <p className="text-2xl font-display font-black text-white">6</p>
              <p className="text-[10px] font-display font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.35)' }}>Credit Hours</p>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <p className="text-2xl font-display font-black text-white">2</p>
              <p className="text-[10px] font-display font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.35)' }}>Courses</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Tab Switcher ─────────────────────── */}
      <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {[
          { key: 'courses', label: 'Courses' },
          { key: 'cost', label: 'Costs' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-2.5 rounded-xl text-xs font-display font-bold transition-all active:scale-95"
            style={{
              background: activeTab === tab.key ? '#E02424' : 'transparent',
              color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.4)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Courses Tab ──────────────────────── */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {COURSES.map((course, i) => {
            const isOpen = expandedId === course.id
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 28 }}
                className="rounded-3xl overflow-hidden"
                style={{ background: 'rgba(18,18,20,0.95)', border: `1px solid ${course.colorBorder}` }}
              >
                {/* Course Header — always visible */}
                <button
                  className="w-full p-5 flex items-start gap-4 active:opacity-80 transition-opacity"
                  onClick={() => setExpandedId(isOpen ? null : course.id)}
                >
                  {/* Grade Ring */}
                  <div className="relative flex-shrink-0">
                    <GradeRing percent={course.gradePercent} color={course.color} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display font-black text-sm text-white">{course.grade}</span>
                    </div>
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge text-[9px]"
                        style={{ background: course.colorBg, color: course.color, border: `1px solid ${course.colorBorder}` }}>
                        {course.code}
                      </span>
                      <span className="badge badge-blue text-[9px]">{course.credits} cr</span>
                    </div>
                    <h4 className="font-display font-bold text-white text-sm leading-tight">
                      {course.shortTitle}
                    </h4>
                    <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {course.instructor}
                    </p>
                  </div>

                  <span className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-5 pb-5 space-y-4"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>

                        {/* Description */}
                        <p className="text-xs leading-relaxed pt-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          {course.description}
                        </p>

                        {/* Location */}
                        <div className="p-3.5 rounded-2xl flex items-start gap-3"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <span className="text-xl"></span>
                          <div>
                            <p className="text-xs font-display font-bold text-white">{course.location}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                              {course.locationNote}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className={`badge text-[9px] ${course.isOnline ? 'badge-blue' : 'badge-green'}`}>
                                {course.isOnline ? 'Online' : 'OIC In Person'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex gap-2 flex-wrap">
                          {course.features.map(f => (
                            <span key={f} className="badge badge-sakura" style={{fontSize:"9px"}}>{f}</span>
                          ))}
                        </div>

                        {/* Assignments */}
                        <div>
                          <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-2"
                            style={{ color: 'rgba(255,255,255,0.3)' }}>
                            Assignments
                          </p>
                          {course.assignments.map(a => <AssignmentRow key={a.name} a={a} />)}
                        </div>

                        {/* Prereq */}
                        <div className="p-3 rounded-xl flex items-center gap-2"
                          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                          <IcAlert size={14} color="#FCD34D" />
                          <p className="text-[11px]" style={{ color: '#FCD34D' }}>
                            Pre-req: {course.prereq}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {/* Program Note */}
          <div className="p-4 rounded-2xl"
            style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)' }}>
            <p className="text-xs font-display font-bold text-white mb-1"> Program Requirement</p>
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Students are required to take <strong className="text-white">both courses</strong> to participate in this program. Non-business majors may apply for a pre-req exception via the OU Education Abroad office.
            </p>
          </div>
        </div>
      )}

      {/* ── Cost Tab ─────────────────────────── */}
      {activeTab === 'cost' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-5 rounded-3xl"
            style={{ background: 'rgba(18,18,20,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-display font-bold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              Estimated Program Costs
            </p>
            <CostBreakdown />
          </div>

          <div className="p-4 rounded-2xl"
            style={{ background: 'rgba(91,138,94,0.08)', border: '1px solid rgba(91,138,94,0.2)' }}>
            <p className="text-xs font-display font-bold text-white mb-1"> Financial Aid</p>
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              OU study abroad programs may be eligible for financial aid. Contact the OU Education Abroad office at <span className="text-white font-semibold">educationabroad@ou.edu</span> for scholarship information.
            </p>
          </div>

          <div className="p-4 rounded-2xl"
            style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-display font-bold uppercase tracking-widest mb-3"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              Included in Program Fee
            </p>
            {[
              'All accommodation (seminar house + hotels)',
              'Orientation tours in Kyoto and Tokyo',
              'Tea ceremony experience',
              'Temple and shrine visits',
              'Business site visits',
              'Guest lecturer sessions',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 py-1.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <IcCheck size={10} color="#86efac" strokeWidth={3} />
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
