// components/CameraView.jsx — AI Camera Translator with Live Mode + Voice
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const MODE_TABS = [
  { id: 'camera', label: '📷 Camera', desc: 'Point at text' },
  { id: 'voice', label: '🎙️ Voice', desc: 'Speak to translate' },
  { id: 'type', label: '⌨️ Type', desc: 'Type text' },
]

export default function CameraView() {
  const [mode, setMode] = useState('camera')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [stream, setStream] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [listening, setListening] = useState(false)
  const [typedText, setTypedText] = useState('')
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const recognitionRef = useRef(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.play()
      }
      setCameraActive(true)
    } catch (err) {
      toast.error('Camera access denied. Please allow camera in browser settings.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setCameraActive(false)
  }, [stream])

  useEffect(() => {
    if (mode === 'camera') startCamera()
    else stopCamera()
    return () => stopCamera()
  }, [mode])

  // Capture frame and translate
  const captureAndTranslate = async () => {
    if (!videoRef.current || !canvasRef.current) return
    setLoading(true)
    setResult(null)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    ctx.drawImage(videoRef.current, 0, 0)
    const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1]

    try {
      const res = await fetch('/api/ai-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'image', imageBase64: base64 }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (err) {
      toast.error(err.message || 'Translation failed')
    }
    setLoading(false)
  }

  // Voice recognition
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { toast.error('Voice not supported on this browser'); return }

    const recognition = new SpeechRecognition()
    recognition.lang = 'ja-JP' // Japanese first
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => { setListening(false); toast.error('Could not hear. Try again.') }
    recognition.onresult = async (e) => {
      const heard = e.results[0][0].transcript
      setTypedText(heard)
      setListening(false)
      await translateText(heard)
    }
    recognition.start()
  }

  const translateText = async (text) => {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/ai-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: 'translate' }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (err) {
      toast.error(err.message || 'Translation failed')
    }
    setLoading(false)
  }

  // Text-to-speech output
  const speak = (text, lang = 'ja-JP') => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.85
    speechSynthesis.speak(utterance)
  }

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="pt-24 px-5 pb-3">
        <p className="text-[10px] font-display font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          AI Japanese Translator
        </p>
      </div>

      {/* Mode tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-1.5 p-1.5 rounded-2xl" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
          {MODE_TABS.map(t => (
            <button key={t.id} onClick={() => { setMode(t.id); setResult(null) }}
              className="flex-1 py-2 rounded-xl font-display font-bold text-xs transition-all"
              style={{
                background: mode === t.id ? 'var(--brand)' : 'transparent',
                color: mode === t.id ? 'white' : 'var(--text-muted)',
                boxShadow: mode === t.id ? '0 4px 12px var(--brand-glow)' : 'none',
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Mode */}
      {mode === 'camera' && (
        <div className="flex-1 flex flex-col px-5 gap-3 overflow-hidden">
          <div className="relative rounded-3xl overflow-hidden flex-1" style={{ border: '1px solid var(--border)', minHeight: 220, maxHeight: 340 }}>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scan overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-32 rounded-2xl" style={{ border: '2px solid var(--brand)', boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)' }} />
            </div>

            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3" style={{ background: 'var(--bg2)' }}>
                <span className="text-4xl">📷</span>
                <p className="text-sm font-display font-bold" style={{ color: 'var(--text-muted)' }}>Camera loading...</p>
              </div>
            )}
          </div>

          <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            Point camera at Japanese text, then tap Translate
          </p>

          <button onClick={captureAndTranslate} disabled={loading || !cameraActive}
            className="w-full py-4 rounded-2xl font-display font-bold text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'var(--brand)', boxShadow: '0 8px 24px var(--brand-glow)' }}>
            {loading
              ? <><span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Analyzing...</>
              : '🔍 Translate Image'}
          </button>
        </div>
      )}

      {/* Voice Mode */}
      {mode === 'voice' && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={listening ? () => { recognitionRef.current?.stop(); setListening(false) } : startVoice}
            className="w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 font-display font-bold text-white text-sm transition-all"
            style={{
              background: listening ? 'var(--brand)' : 'var(--surface2)',
              border: `3px solid ${listening ? 'var(--brand)' : 'var(--border)'}`,
              boxShadow: listening ? '0 0 40px var(--brand-glow), 0 0 80px var(--brand-glow)' : 'none',
            }}
            animate={listening ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <span className="text-4xl">{listening ? '🎙️' : '🎤'}</span>
            <span>{listening ? 'Listening...' : 'Tap to speak'}</span>
          </motion.button>

          <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {listening ? 'Speak in Japanese or English' : 'Speak Japanese or English to translate'}
          </p>

          {loading && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-light)' }}>
              <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Translating with AI...
            </div>
          )}
        </div>
      )}

      {/* Type Mode */}
      {mode === 'type' && (
        <div className="flex-1 flex flex-col px-5 gap-3">
          <textarea
            value={typedText}
            onChange={e => setTypedText(e.target.value)}
            placeholder="Type Japanese or English text here..."
            className="w-full p-4 rounded-2xl font-body text-base resize-none"
            rows={5}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              color: 'var(--text)', outline: 'none', fontFamily: "'Noto Sans JP', sans-serif"
            }}
          />
          <button onClick={() => translateText(typedText)} disabled={loading || !typedText.trim()}
            className="w-full py-4 rounded-2xl font-display font-bold text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'var(--brand)', boxShadow: '0 8px 24px var(--brand-glow)' }}>
            {loading
              ? <><span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Translating...</>
              : '✨ Translate with AI'}
          </button>
        </div>
      )}

      {/* Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="mx-5 mb-32 rounded-3xl p-5 space-y-3"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-display font-bold uppercase tracking-widest" style={{ color: 'var(--brand-light)' }}>
                AI Translation
              </span>
              <div className="flex gap-2">
                {result.translation && (
                  <button onClick={() => speak(result.original || result.translation, 'ja-JP')}
                    className="text-xs px-3 py-1 rounded-full font-display font-bold"
                    style={{ background: 'var(--brand-subtle)', color: 'var(--brand-light)' }}>
                    🔊 JP
                  </button>
                )}
                <button onClick={() => speak(result.translation, 'en-US')}
                  className="text-xs px-3 py-1 rounded-full font-display font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                  🔊 EN
                </button>
              </div>
            </div>

            {result.original && (
              <div>
                <p className="text-[9px] font-display font-bold uppercase" style={{ color: 'var(--text-dim)' }}>Original</p>
                <p className="text-lg font-jp mt-0.5" style={{ color: 'var(--text)' }}>{result.original}</p>
              </div>
            )}
            {result.romaji && (
              <div>
                <p className="text-[9px] font-display font-bold uppercase" style={{ color: 'var(--text-dim)' }}>Pronunciation</p>
                <p className="text-sm italic mt-0.5" style={{ color: 'var(--text-muted)' }}>{result.romaji}</p>
              </div>
            )}
            <div>
              <p className="text-[9px] font-display font-bold uppercase" style={{ color: 'var(--text-dim)' }}>Translation</p>
              <p className="text-base font-display font-bold mt-0.5" style={{ color: 'var(--text)' }}>{result.translation}</p>
            </div>
            {result.context && (
              <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-[9px] font-display font-bold uppercase" style={{ color: 'var(--text-dim)' }}>Cultural Context</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{result.context}</p>
              </div>
            )}

            <button onClick={() => setResult(null)}
              className="w-full py-2 rounded-xl text-xs font-display font-bold mt-1"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
