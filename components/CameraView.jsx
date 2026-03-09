// components/CameraView.jsx
import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import useStore from '../utils/store'

export default function CameraView() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [mode, setMode] = useState('idle') // idle | camera | result | loading
  const [translation, setTranslation] = useState(null)
  const [manualText, setManualText] = useState('')
  const [cameraError, setCameraError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const { setLastTranslation } = useStore()

  // ─── Camera Controls ────────────────────────
  const startCamera = async () => {
    setCameraError(null)
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Rear camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setMode('camera')
    } catch (err) {
      const msg =
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser settings.'
          : err.name === 'NotFoundError'
          ? 'No camera found on this device.'
          : `Camera error: ${err.message}`
      setCameraError(msg)
      toast.error(msg, { duration: 4000 })
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setMode('idle')
  }

  useEffect(() => () => stopCamera(), [])

  // ─── Capture & OCR ──────────────────────────
  const captureAndTranslate = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsProcessing(true)
    setProgress(0)
    setMode('loading')

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    stopCamera()

    try {
      // Dynamically import Tesseract to avoid SSR issues
      const Tesseract = (await import('tesseract.js')).default

      setProgress(10)

      const result = await Tesseract.recognize(canvas, 'jpn+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 80) + 10)
          }
        },
      })

      const detectedText = result.data.text.trim()
      setProgress(90)

      if (!detectedText || detectedText.length < 1) {
        toast.error('No text detected. Try better lighting or hold steady.')
        setMode('idle')
        setIsProcessing(false)
        return
      }

      // Send to translation API
      const resp = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: detectedText }),
      })

      const data = await resp.json()
      setProgress(100)

      const fullResult = {
        ...data,
        capturedImage: canvas.toDataURL('image/jpeg', 0.8),
      }

      setTranslation(fullResult)
      setLastTranslation(fullResult)
      setMode('result')
      toast.success('Translation complete!', { icon: '🀄' })
    } catch (err) {
      console.error('OCR error:', err)
      toast.error('Failed to process image. Please try again.')
      setMode('idle')
    } finally {
      setIsProcessing(false)
    }
  }, [setLastTranslation])

  // ─── Manual Text Translation ─────────────────
  const translateManual = async () => {
    if (!manualText.trim()) return
    setIsProcessing(true)
    try {
      const resp = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: manualText }),
      })
      const data = await resp.json()
      setTranslation(data)
      setLastTranslation(data)
      setMode('result')
    } catch {
      toast.error('Translation failed')
    } finally {
      setIsProcessing(false)
    }
  }

  // ─── RENDER ──────────────────────────────────
  return (
    <div className="px-5 pb-6 space-y-5">

      {/* ── Mode Toggle ──────────────────────── */}
      <div className="flex gap-2 p-1.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => { setMode('idle'); setTranslation(null) }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-display font-bold transition-all ${mode === 'idle' || mode === 'result' ? 'bg-brand text-white' : 'text-white/40'}`}
        >
          Type Text
        </button>
        <button
          onClick={startCamera}
          className={`flex-1 py-2.5 rounded-xl text-sm font-display font-bold transition-all ${mode === 'camera' || mode === 'loading' ? 'bg-brand text-white' : 'text-white/40'}`}
        >
          Camera
        </button>
      </div>

      {/* ── Camera View ──────────────────────── */}
      <AnimatePresence mode="wait">
        {mode === 'camera' && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative rounded-3xl overflow-hidden"
            style={{ aspectRatio: '4/3', background: '#000' }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Scanner overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-40">
                <div className="scanner-corner tl" />
                <div className="scanner-corner tr" />
                <div className="scanner-corner bl" />
                <div className="scanner-corner br" />
                <div className="scan-line" />
                <div
                  className="absolute inset-0 rounded"
                  style={{ background: 'rgba(224,36,36,0.03)' }}
                />
              </div>
            </div>

            {/* Instruction overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4 text-center"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
            >
              <p className="text-xs font-display font-semibold text-white/70">
                Point at Japanese text • Menu, Signs, Packages
              </p>
            </div>

            {/* Controls */}
            <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={stopCamera}
                className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
              >
                <IcX size={16} color="white" strokeWidth={2.5} />
              </button>
              <button
                onClick={captureAndTranslate}
                className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                style={{
                  background: 'white',
                  boxShadow: '0 0 0 4px rgba(255,255,255,0.3)',
                }}
              >
                <div className="w-12 h-12 rounded-full bg-brand" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Loading ──────────────────────────── */}
        {mode === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 flex flex-col items-center gap-4"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(224,36,36,0.15)', border: '1px solid rgba(224,36,36,0.3)' }}
            >
              <span className="text-2xl animate-spin">⟳</span>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-white mb-1">Analyzing text...</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {progress < 50 ? 'Detecting Japanese characters' : progress < 85 ? 'Processing OCR' : 'Translating...'}
              </p>
            </div>
            <div className="w-48 progress-bar mt-2">
              <motion.div
                className="progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Manual Input ────────────────────── */}
      {(mode === 'idle' || mode === 'result') && (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Paste or type Japanese text here...&#10;例: ラーメン、寿司、定食"
              className="input-field font-jp resize-none h-32 leading-relaxed"
              style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
            />
            {manualText && (
              <button
                onClick={() => setManualText('')}
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={translateManual}
            disabled={!manualText.trim() || isProcessing}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {isProcessing ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <>
                <span>🀄</span>
                <span>Translate</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Camera Error ─────────────────────── */}
      {cameraError && (
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(224,36,36,0.1)', border: '1px solid rgba(224,36,36,0.25)' }}>
          <p className="text-sm font-display font-semibold text-red-400">{cameraError}</p>
        </div>
      )}

      {/* ── Hidden Canvas for Capture ─────────── */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Translation Result ───────────────── */}
      <AnimatePresence>
        {translation && mode === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Source */}
            <div
              className="p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-xs font-display font-bold uppercase tracking-widest mb-2"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                Original · {translation.script}
              </p>
              <p className="font-jp text-xl text-white leading-relaxed">{translation.original}</p>
              {translation.romanization && (
                <p className="font-mono text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {translation.romanization}
                </p>
              )}
            </div>

            {/* Translation */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(224,36,36,0.12) 0%, rgba(18,18,20,0.95) 100%)',
                border: '1px solid rgba(224,36,36,0.2)',
              }}
            >
              <p className="text-xs font-display font-bold uppercase tracking-widest mb-3"
                style={{ color: '#FF8E8E' }}>
                English Translation
              </p>
              <p className="text-xl font-display font-semibold text-white leading-relaxed">
                {translation.translated}
              </p>
            </div>

            {/* Script type badge */}
            <div className="flex gap-2 flex-wrap">
              <span className="badge badge-brand">
                {translation.script === 'kanji' ? '漢字 Kanji' :
                 translation.script === 'hiragana' ? 'ひらがな Hiragana' :
                 translation.script === 'katakana' ? 'カタカナ Katakana' : 'Mixed'}
              </span>
              <span className="badge badge-blue">DeepL AI</span>
            </div>

            {/* Captured image if from camera */}
            {translation.capturedImage && (
              <div className="rounded-2xl overflow-hidden">
                <img src={translation.capturedImage} alt="Captured" className="w-full h-36 object-cover" />
              </div>
            )}

            {/* Phrases guide */}
            <div
              className="p-4 rounded-2xl"
              style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-xs font-display font-bold uppercase tracking-widest mb-3"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                Useful Phrases
              </p>
              {[
                { jp: 'これをください', rom: 'Kore wo kudasai', en: 'I\'ll have this one, please' },
                { jp: 'いくらですか', rom: 'Ikura desu ka', en: 'How much is it?' },
                { jp: 'おすすめは何ですか', rom: 'Osusume wa nan desu ka', en: 'What do you recommend?' },
              ].map((phrase) => (
                <div key={phrase.jp} className="mb-2 last:mb-0">
                  <p className="font-jp text-white text-sm">{phrase.jp}</p>
                  <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{phrase.rom} · {phrase.en}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
