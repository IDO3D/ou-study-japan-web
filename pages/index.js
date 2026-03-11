// pages/index.js — Cinematic Landing Page (Restored & Fixed)
import Head from 'next/head'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabase'

const YOUTUBE_BACKGROUND_ID = "xXiSN8Tftjg" // Updated verified 2026 Japan ID

const FEATURES = [
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 20l-5-3V4l5 3 5-3 5 3v13l-5-3-5 3z" /><path d="M9 4v13" /><path d="M14 7v13" /></svg>, title: 'Interactive Route Map', desc: 'Seamlessly navigate through Ibaraki, Kyoto, and Tokyo. Live updates and curated points of interest.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>, title: 'Digital Suica Wallet', desc: 'Manage your transit card, convert USD to JPY instantly, and locate the nearest foreign-friendly ATMs.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>, title: 'Health & Safety Hub', desc: 'Direct emergency dials, local hospital routes, and translated medical phrasing for instant peace of mind.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><path d="M6 1v3" /><path d="M10 1v3" /><path d="M14 1v3" /></svg>, title: 'Curated Food Discover', desc: 'Browse curated convenience store grabs to authentic local izakayas. Read menus before you arrive.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>, title: 'Cinematic Photo Reel', desc: 'Compile your study abroad journey. Add captions and let the app build an autoplaying cinematic memory.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>, title: 'Points & Quests', desc: 'Engage with local culture through gamified challenges and earn rewards while discovering Japan.' },
]

export default function LandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [videoExpanded, setVideoExpanded] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const heroRef = useRef(null)
  const iframeRef = useRef(null)

  useEffect(() => {
    // Auth check: if logged in, skip landing page
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        setLoading(false)
      }
    }
    checkAuth()

    // Listen for auth changes to handle external sign-outs
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard')
      } else if (event === 'SIGNED_OUT') {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const toggleMute = (e) => {
    if (e) e.stopPropagation()
    const iframe = iframeRef.current
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: isMuted ? 'unMute' : 'mute',
        args: []
      }), '*')
      setIsMuted(!isMuted)
    }
  }

  useEffect(() => {
    let touchStartY = 0
    let accumulatedDelta = 0

    const exitVideo = () => {
      setVideoExpanded(false)
      if (!isMuted) toggleMute()
    }

    const handleWheel = (e) => {
      accumulatedDelta += Math.abs(e.deltaY)
      if (accumulatedDelta > 60 && videoExpanded) exitVideo()
    }

    const handleTouchStart = (e) => touchStartY = e.touches[0].clientY
    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY
      if (Math.abs(touchStartY - touchY) > 60 && videoExpanded) exitVideo()
    }

    const handleKey = (e) => { if (e.key === 'Escape' && videoExpanded) exitVideo() }

    if (videoExpanded) {
      accumulatedDelta = 0
      window.addEventListener('wheel', handleWheel, { passive: true })
      window.addEventListener('touchstart', handleTouchStart, { passive: true })
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
      window.addEventListener('keydown', handleKey, { passive: true })
    }
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKey)
    }
  }, [videoExpanded, isMuted])

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#E02424] animate-spin" />
    </div>
  }

  return (
    <>
      <Head>
        <title>OUStudyJapan — Immersive Experience 2026</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </Head>

      <div className="bg-black min-h-screen text-white selection:bg-[#E02424] selection:text-white font-sans overflow-x-hidden">

        {/* Cinematic Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 sm:px-12 py-8 mix-blend-difference">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5">
              <div className="w-full h-full bg-[#E02424] rounded-full"></div>
            </div>
            <span className="font-display font-black text-white tracking-[0.15em] text-xs uppercase">OUStudyJapan.</span>
          </div>

          <div className="hidden md:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#wallet" className="hover:text-white transition-colors">Wallet</a>
            <a href="#food" className="hover:text-white transition-colors">Food</a>
            <Link href="/login" className="hidden sm:block text-[10px] font-bold text-white tracking-[0.2em] uppercase hover:text-white/70 transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="hidden sm:block border border-white/30 px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all backdrop-blur-sm shadow-sm">
              Apply Now
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={mobileMenuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xl font-display font-bold uppercase tracking-widest text-white">Features</a>
              <Link href="/login" className="text-xl font-display font-bold uppercase tracking-widest text-white">Sign In</Link>
              <Link href="/sign-up" className="px-12 py-4 bg-[#E02424] text-white font-bold rounded-full uppercase tracking-widest">Apply Now</Link>
              <button onClick={()=>setMobileMenuOpen(false)} className="mt-8 text-white/40 font-bold uppercase tracking-widest text-xs">Close</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Layer */}
        <div className={`fixed inset-0 bg-black pointer-events-none transition-all duration-1000 ${videoExpanded ? 'z-[100]' : 'z-0'}`}>
          <motion.div style={{ opacity }} className="absolute inset-0 transition-transform duration-1000" animate={{ scale: videoExpanded ? 1.05 : 1 }}>
            <div className={`absolute w-[400vw] h-[400vh] -top-[150vh] -left-[150vw] sm:w-[150vw] sm:h-[150vh] sm:-top-[25vh] sm:-left-[25vw] pointer-events-none transition-opacity duration-1000 ${videoExpanded ? 'opacity-100 mix-blend-normal' : 'opacity-40 mix-blend-screen'}`}>
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${YOUTUBE_BACKGROUND_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${YOUTUBE_BACKGROUND_ID}&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`}
                allow="autoplay; fullscreen; picture-in-picture"
                className="w-full h-full object-cover scale-110 pointer-events-none"
              />
            </div>
          </motion.div>
          <div className={`absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black transition-opacity duration-1000 ${videoExpanded ? 'opacity-0' : 'opacity-100'}`}></div>
          
          <div className={`absolute bottom-20 inset-x-0 flex flex-col items-center gap-6 transition-all duration-1000 ${videoExpanded ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <button onClick={toggleMute} className="w-16 h-16 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              {isMuted ? 'UNMUTE' : 'MUTE'}
            </button>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/50">Scroll to Exit</p>
          </div>
        </div>

        {/* Content Layer */}
        <section ref={heroRef} className="relative min-h-screen flex items-center px-6 sm:px-20 lg:px-44 z-10">
          <div className="max-w-4xl">
            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:1, delay:0.2 }}
              className="font-display font-medium text-5xl sm:text-7xl lg:text-9xl leading-[1.0] tracking-tighter mb-10">
              Capture Your <br /> Japan Story.
            </motion.h1>
            
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }} className="flex items-center gap-6 mb-12">
              <button onClick={() => setVideoExpanded(true)} className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all group">
                <span className="text-xl group-hover:scale-110 transition-transform">▶</span>
              </button>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-1">See cinematic video</p>
                <p className="text-xs font-bold uppercase tracking-widest">Global Experience 2026</p>
              </div>
            </motion.div>

            <Link href="/sign-up" className="inline-block px-16 py-6 bg-[#E02424] text-white font-bold text-xs tracking-[0.3em] uppercase hover:bg-red-700 transition-colors shadow-2xl">
              Start Now
            </Link>
          </div>
        </section>

        {/* Features Preview */}
        <section id="features" className="relative z-10 py-32 px-6 sm:px-12 border-t border-white/10 bg-black">
          <div className="max-w-7xl mx-auto">
             <div className="mb-24">
                <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tighter mb-6">Absolute Mobility.</h2>
                <p className="text-white/50 max-w-lg text-lg leading-relaxed font-medium">Redesigned for the 2026 study abroad program. Every tool you need, exactly when you need it.</p>
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                {FEATURES.map(f => (
                   <div key={f.title} className="group">
                      <div className="mb-8 text-[#E02424]">{f.icon}</div>
                      <h3 className="text-2xl font-display font-bold mb-4 tracking-tight border-b border-white/10 pb-4">{f.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                   </div>
                ))}
             </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="relative z-10 py-32 text-center border-t border-white/10">
           <h2 className="text-4xl sm:text-7xl font-display font-black tracking-tighter mb-12">Study Abroad with OU.</h2>
           <div className="flex flex-col sm:flex-row justify-center gap-6 px-10">
              <Link href="/sign-up" className="px-16 py-6 bg-white text-black font-bold text-xs tracking-[0.3em] uppercase hover:bg-white/90 transition-all text-center">Sign Up</Link>
              <Link href="/login" className="px-16 py-6 bg-white/5 border border-white/20 text-white font-bold text-xs tracking-[0.3em] uppercase hover:bg-white/10 transition-all text-center">Sign In</Link>
           </div>
        </section>

        <footer className="relative z-10 py-16 text-center text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase">
          OUStudyJapan © 2026 UNIVERSITY OF OKLAHOMA
        </footer>
      </div>
    </>
  )
}


