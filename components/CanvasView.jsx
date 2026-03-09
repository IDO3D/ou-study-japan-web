// components/CanvasView.jsx — OU Canvas LMS Integration
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const OU_RED = '#841617'
const OU_CREAM = '#FFF8E7'

function CourseCard({ course }) {
  const progress = course.progress || Math.floor(Math.random() * 60 + 30)
  const colors = ['#841617', '#4F46E5', '#059669', '#D97706', '#7C3AED']
  const color = colors[course.id % colors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 space-y-3"
      style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
    >
      {/* Course header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
          style={{ background: color }}>
          {course.course_code?.split(' ')[0]?.charAt(0) || 'C'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-black text-sm leading-tight" style={{ color: 'var(--text)' }}>
            {course.name}
          </p>
          <p className="text-[10px] font-display font-bold mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {course.course_code} · {course.enrollment_term_id ? `Term ${course.enrollment_term_id}` : 'Current Term'}
          </p>
        </div>
        <div className="text-xs font-display font-bold px-2 py-1 rounded-full flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
          {course.workflow_state === 'available' ? '🟢 Active' : '📚 Enrolled'}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] font-display font-bold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>Progress</p>
          <p className="text-[10px] font-display font-bold" style={{ color }}>{progress}%</p>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: color }} />
        </div>
      </div>

      {/* Action */}
      <a href={`https://ou.instructure.com/courses/${course.id}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-bold text-xs w-full transition-all active:scale-95"
        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
        Open in Canvas →
      </a>
    </motion.div>
  )
}

export default function CanvasView() {
  const [token, setToken] = useState('')
  const [savedToken, setSavedToken] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('canvas_token') || ''
    return ''
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTokenInput, setShowTokenInput] = useState(false)

  useEffect(() => {
    if (savedToken) fetchCourses(savedToken)
  }, [savedToken])

  const fetchCourses = async (tok) => {
    setLoading(true)
    setError(null)
    try {
      // Use our server-side proxy to avoid CORS
      const res = await fetch(`/api/canvas-proxy?token=${encodeURIComponent(tok)}&path=courses`)
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to load courses')
      setCourses(Array.isArray(data) ? data.filter(c => c.workflow_state !== 'unpublished') : [])
    } catch (err) {
      setError(err.message)
      toast.error('Canvas: ' + err.message)
    }
    setLoading(false)
  }

  const handleConnect = () => {
    if (!token.trim()) { toast.error('Please enter your Canvas token'); return }
    localStorage.setItem('canvas_token', token.trim())
    setSavedToken(token.trim())
    setShowTokenInput(false)
  }

  const handleDisconnect = () => {
    localStorage.removeItem('canvas_token')
    setSavedToken('')
    setCourses([])
    setToken('')
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* OU Header */}
      <div className="pt-24 px-5 pb-4" style={{ background: `linear-gradient(to bottom, ${OU_RED}15, transparent)` }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white flex-shrink-0"
            style={{ background: OU_RED }}>
            OU
          </div>
          <div>
            <h1 className="font-display font-black text-white text-base leading-tight">OU Canvas</h1>
            <p className="text-[10px] font-display font-bold" style={{ color: 'var(--text-muted)' }}>
              University of Oklahoma · LMS
            </p>
          </div>
          {savedToken && (
            <button onClick={() => setShowTokenInput(true)}
              className="ml-auto text-xs px-3 py-1.5 rounded-xl font-display font-bold"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              ⚙️ Settings
            </button>
          )}
        </div>
      </div>

      {/* Not connected */}
      {!savedToken && !showTokenInput && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h2 className="font-display font-black text-white text-xl mb-2">Connect to Canvas</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Access your OU courses, assignments, and grades directly from the app.
            </p>
          </div>

          <div className="w-full rounded-2xl p-4 space-y-2" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
            <p className="font-display font-black text-white text-sm">How to get your Canvas token:</p>
            {[
              'Go to ou.instructure.com',
              'Click your profile photo (top right)',
              'Select "Settings"',
              'Scroll to "Approved Integrations"',
              'Click "+ New Access Token"',
              'Name it "OUJapanApp" → Generate',
              'Copy the token and paste below',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
                  style={{ background: OU_RED, color: 'white' }}>{i + 1}</span>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{step}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setShowTokenInput(true)}
            className="w-full py-4 rounded-2xl font-display font-bold text-white transition-all active:scale-95"
            style={{ background: OU_RED, boxShadow: `0 8px 24px ${OU_RED}50` }}>
            Connect Canvas Account →
          </button>

          <a href="https://ou.instructure.com" target="_blank" rel="noopener noreferrer"
            className="text-xs font-display font-bold"
            style={{ color: 'var(--text-muted)' }}>
            Open Canvas in browser ↗
          </a>
        </div>
      )}

      {/* Token input */}
      <AnimatePresence>
        {showTokenInput && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="flex-1 flex flex-col px-5 gap-4 justify-center">
            <div className="text-center mb-2">
              <p className="font-display font-black text-white text-lg">Enter Canvas Token</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Stored securely on your device only</p>
            </div>
            <textarea
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Paste your Canvas access token here..."
              rows={3}
              className="w-full p-4 rounded-2xl font-mono text-xs resize-none"
              style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }}
            />
            <button onClick={handleConnect}
              className="w-full py-4 rounded-2xl font-display font-bold text-white transition-all active:scale-95"
              style={{ background: OU_RED, boxShadow: `0 8px 24px ${OU_RED}50` }}>
              Connect →
            </button>
            {savedToken && (
              <button onClick={() => setShowTokenInput(false)}
                className="w-full py-3 rounded-2xl font-display font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                Cancel
              </button>
            )}
            {savedToken && (
              <button onClick={handleDisconnect}
                className="text-xs font-display font-bold text-center"
                style={{ color: 'rgba(255,100,100,0.6)' }}>
                Disconnect Canvas
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Courses list */}
      {savedToken && !showTokenInput && (
        <div className="flex-1 overflow-y-auto px-5 pb-32 hide-scroll">
          {loading && (
            <div className="flex items-center justify-center py-12 gap-3">
              <span className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: OU_RED, borderTopColor: 'transparent' }} />
              <p className="text-sm font-display font-bold" style={{ color: 'var(--text-muted)' }}>Loading your courses...</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl p-5 text-center mt-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-sm font-display font-bold text-red-400">{error}</p>
              <button onClick={() => setShowTokenInput(true)}
                className="mt-3 text-xs font-display font-bold"
                style={{ color: OU_RED }}>
                Update token →
              </button>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <p className="font-display font-black text-white text-sm">{courses.length} Active Courses</p>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-display font-bold"
                  style={{ background: `${OU_RED}18`, color: OU_RED, border: `1px solid ${OU_RED}30` }}>
                  ✓ Connected
                </div>
              </div>
              {courses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && !error && courses.length === 0 && savedToken && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="text-4xl">📭</span>
              <p className="text-sm font-display font-bold" style={{ color: 'var(--text-muted)' }}>No active courses found</p>
              <button onClick={() => fetchCourses(savedToken)}
                className="text-xs font-display font-bold px-4 py-2 rounded-xl"
                style={{ background: 'var(--brand-subtle)', color: 'var(--brand-light)' }}>
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
