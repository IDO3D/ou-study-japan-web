// pages/index.js — Cinematic Landing Page
import Head from 'next/head'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

// =========================================================================
// TO EDIT THE BACKGROUND VIDEO:
// Simply paste the direct URL to any .mp4 file. HTML5 <video> tags ensure
// seamless autoplay on both Desktop and Mobile (unlike YouTube embeds).
// Provide a 16:9 format video for Desktop and a 9:16 format vertical video for Mobile!
// =========================================================================
const BACKGROUND_VIDEO_DESKTOP = "https://cdn.coverr.co/videos/coverr-walking-through-a-neon-lit-street-in-japan-2514/1080p.mp4"
const BACKGROUND_VIDEO_MOBILE = "https://cdn.coverr.co/videos/coverr-a-rainy-night-in-japan-2518/1080p.mp4"

const FEATURES = [
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 20l-5-3V4l5 3 5-3 5 3v13l-5-3-5 3z" /><path d="M9 4v13" /><path d="M14 7v13" /></svg>, title: 'Interactive Route Map', desc: 'Seamlessly navigate through Ibaraki, Kyoto, and Tokyo. Live updates and curated points of interest.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>, title: 'Digital Suica Wallet', desc: 'Manage your transit card, convert USD to JPY instantly, and locate the nearest foreign-friendly ATMs.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>, title: 'Health & Safety Hub', desc: 'Direct emergency dials, local hospital routes, and translated medical phrasing for instant peace of mind.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><path d="M6 1v3" /><path d="M10 1v3" /><path d="M14 1v3" /></svg>, title: 'Curated Food Discover', desc: 'Browse curated convenience store grabs to authentic local izakayas. Read menus before you arrive.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>, title: 'Cinematic Photo Reel', desc: 'Compile your study abroad journey. Add captions and let the app build an autoplaying cinematic memory.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>, title: 'Points & Quests', desc: 'Engage with local culture through gamified challenges and earn rewards while discovering Japan.' },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <>
      <Head>
        <title>OUStudyJapan — Cinematic Experience</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div className="bg-black min-h-screen text-white selection:bg-[#E02424] selection:text-white font-sans overflow-x-hidden">

        {/* JTRIP-Style Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-6 sm:py-8 lg:px-16 w-full mix-blend-difference">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center p-1 sm:p-1.5">
              <div className="w-full h-full bg-[#E02424] rounded-full"></div>
            </div>
            <span className="font-display font-black text-white tracking-[0.1em] sm:tracking-[0.15em] text-[10px] sm:text-xs uppercase break-keep whitespace-nowrap">OUStudyJapan.</span>
          </div>

          {/* Center Links (Desktop only) */}
          <div className="hidden md:flex items-center gap-12 font-medium text-[10px] uppercase tracking-[0.2em] text-white/70">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#wallet" className="hover:text-white transition-colors">Wallet</Link>
            <Link href="#safety" className="hover:text-white transition-colors">Safety & Travel</Link>
            <Link href="#food" className="hover:text-white transition-colors">Food</Link>
          </div>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/login" className="hidden sm:block text-[10px] font-bold text-white tracking-[0.2em] uppercase hover:text-white/70 transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="text-white hover:text-white/70 transition-colors hidden sm:block">
              <div className="border border-white/30 px-6 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors backdrop-blur-sm">
                Apply Now
              </div>
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="block md:hidden text-white p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={mobileMenuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden text-lg font-display uppercase tracking-widest text-white/80">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-white active:scale-95 transition-all">Features</Link>
            <Link href="#wallet" onClick={() => setMobileMenuOpen(false)} className="hover:text-white active:scale-95 transition-all">Wallet</Link>
            <Link href="#safety" onClick={() => setMobileMenuOpen(false)} className="hover:text-white active:scale-95 transition-all">Safety & Travel</Link>
            <Link href="#food" onClick={() => setMobileMenuOpen(false)} className="hover:text-white active:scale-95 transition-all">Food</Link>
            <div className="w-12 h-px bg-white/20 my-4" />
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-white active:scale-95 transition-all text-sm">Sign In</Link>
            <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)} className="px-8 py-3 bg-white text-black font-bold text-sm rounded-full active:scale-95 transition-all">
              Apply Now
            </Link>
          </div>
        )}

        {/* Animated Cinematic Background for ENTIRE PAGE */}
        <div className="fixed inset-0 z-0 bg-black pointer-events-none">
          <motion.div style={{ opacity }} className="absolute inset-0">
            {/* Desktop HTML5 Video Background (16:9) */}
            <video
              src={BACKGROUND_VIDEO_DESKTOP}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none mix-blend-screen hidden md:block"
            />
            {/* Mobile HTML5 Video Background (9:16) */}
            <video
              src={BACKGROUND_VIDEO_MOBILE}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none mix-blend-screen block md:hidden"
            />
          </motion.div>
          {/* Global Dark moody gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/95"></div>
        </div>

        {/* Cinematic Hero Section */}
        <section ref={heroRef} className="relative min-h-screen w-full flex items-center overflow-hidden pt-24 pb-16 z-10">

          {/* Left Vertical Indicator */}
          <div className="absolute left-2 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 sm:gap-6 z-20 mix-blend-difference">
            <span className="text-[7px] sm:text-[9px] font-bold text-white tracking-widest">01</span>
            <div className="w-[1px] h-20 sm:h-32 bg-white/20 relative">
              <motion.div style={{ height: useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]) }} className="absolute top-0 left-0 w-full bg-white"></motion.div>
            </div>
            <span className="text-[7px] sm:text-[9px] font-bold text-white/50 tracking-widest">03</span>
          </div>

          {/* Bottom Left Socials */}
          <div className="absolute bottom-6 sm:bottom-10 left-10 sm:left-12 lg:left-24 flex items-center gap-4 sm:gap-8 z-20 text-[8px] sm:text-[10px] font-bold text-white tracking-widest mix-blend-difference">
            <a href="#" className="hover:text-white/70 transition-colors">Fb.</a>
            <a href="#" className="hover:text-white/70 transition-colors">Tw.</a>
            <a href="#" className="hover:text-white/70 transition-colors">In.</a>
          </div>

          {/* Bottom Right Card (Matches JTRIP) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-6 sm:bottom-10 right-4 sm:right-6 lg:right-16 z-20 w-[65vw] max-w-[240px] sm:max-w-none sm:w-[340px] bg-[#0c0c0e]/80 backdrop-blur-md p-3 sm:p-6 flex items-center gap-2 sm:gap-5 hover:bg-black transition-colors cursor-pointer group shadow-2xl border border-white/5"
          >
            <div className="flex-1">
              <div className="flex gap-1 sm:gap-1.5 mb-2 sm:mb-4">
                <div className="w-3 sm:w-4 h-[2px] bg-white"></div>
                <div className="w-1 h-[2px] bg-white/30"></div>
                <div className="w-1 h-[2px] bg-white/30"></div>
                <div className="w-1 h-[2px] bg-white/30"></div>
              </div>
              <p className="text-[10px] sm:text-sm font-bold text-white leading-snug pr-2 mb-1 sm:mb-2">5 best places in Japan.</p>
              <span className="text-[7px] sm:text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-1 sm:gap-2 group-hover:gap-3 transition-all">
                More <span className="text-[#E02424] text-xs sm:text-lg leading-none">→</span>
              </span>
            </div>
            <div className="w-12 h-10 sm:w-28 sm:h-20 bg-white/5 overflow-hidden relative rounded-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Main Hero Content (Left Aligned) */}
          <div className="relative z-10 w-full pl-8 sm:pl-20 md:px-32 lg:px-44">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-display font-medium text-white leading-[1.1] tracking-tight mb-6 sm:mb-8 text-shadow-xl"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
            >
              Capture Your <br className="hidden sm:block" />
              Japan Story.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex items-center gap-3 sm:gap-5 mb-8 sm:mb-12"
            >
              <button className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all group backdrop-blur-sm shadow-xl flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="ml-1 sm:ml-1.5 group-hover:scale-110 transition-transform sm:w-[18px] sm:h-[18px]"><path d="M5 3l14 9-14 9V3z" /></svg>
              </button>
              <div>
                <p className="text-[8px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 mb-1 sm:mb-1.5">See video</p>
                <p className="text-[9px] sm:text-xs uppercase font-bold tracking-[0.1em] text-white">OU STUDY ABROAD 2026</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Link href="/sign-up" className="inline-block px-8 py-4 sm:px-12 sm:py-5 bg-[#E02424] text-white font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase hover:bg-red-700 transition-colors shadow-xl text-center">
                Explore
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Sleek Features Typography */}
        <section id="features" className="relative z-10 py-24 sm:py-32 px-6 lg:px-16">
          <div className="max-w-7xl mx-auto border-t border-white/20 pt-16">
            <div className="mb-16 sm:mb-24 flex flex-col sm:flex-row justify-between items-end gap-10">
              <h2 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl tracking-tight m-0 text-white max-w-xl">
                Information without the clutter.
              </h2>
              <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase max-w-xs leading-relaxed m-0">Everything you need while standing on the streets of Tokyo, Kyoto, or Ibaraki.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="w-8 h-8 flex items-center justify-center text-white/70 group-hover:text-[#E02424] transition-colors mb-6">
                    {f.icon}
                  </div>
                  <h3 className="font-display font-medium text-xl sm:text-2xl mb-4 tracking-tight text-white m-0 border-b border-white/10 pb-4">{f.title}</h3>
                  <p className="text-white/50 leading-relaxed text-xs sm:text-sm font-medium m-0 tracking-wide pt-2">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Wallet Visual Break-out Section */}
        <section id="wallet" className="relative z-10 py-24 px-6 lg:px-16 overflow-hidden border-t border-white/20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E02424]/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <h2 className="font-display font-black text-5xl lg:text-7xl tracking-tighter leading-tight m-0">Your Japanese<br /><span className="text-[#E02424]">Digital Wallet</span></h2>
              <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-xl mx-auto lg:mx-0 m-0 font-medium">
                Seamless Apple Pay integration for your Suica card. Live JPY to USD exchange rates. Instant routing to foreign-friendly ATMs like 7-Eleven.
              </p>
              <Link href="/sign-up" className="inline-flex px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-white/10">
                Experience Wallet
              </Link>
            </div>

            <div className="flex-1 w-full max-w-sm mx-auto relative perspective-1000">
              <motion.div
                initial={{ rotateY: -15, rotateX: 5, opacity: 0, x: 50 }}
                whileInView={{ rotateY: -5, rotateX: 5, opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, type: 'spring' }}
                className="aspect-[9/19] rounded-[3rem] border-[10px] border-[#0a0a0c] bg-[#0a0a0c] relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(224,36,36,0.3)] ring-1 ring-white/10"
              >
                {/* iPhone Dynamic Island */}
                <div className="absolute top-3 inset-x-0 flex justify-center z-30">
                  <div className="w-24 h-7 bg-black rounded-full flex justify-between items-center px-2">
                    <div className="w-2 h-2 rounded-full bg-green-900/40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="absolute top-0 inset-x-0 h-12 flex justify-between items-center px-6 z-20 text-[10px] font-bold text-white tracking-widest pt-2 mix-blend-difference">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="text-[8px] mt-0.5">5G</span>
                    <span className="text-xs">📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-[#18181b] via-[#09090b] to-[#050505]"></div>

                {/* Mock Phone UI */}
                <div className="relative z-10 p-5 pt-20 flex flex-col gap-4">

                  {/* Digital Wallet Card */}
                  <div className="bg-gradient-to-br from-emerald-500 to-green-900 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden group border border-white/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl transform group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <p className="text-[10px] uppercase tracking-widest opacity-90 font-bold m-0 flex items-center gap-1.5">
                        <span className="text-sm">🍏</span> Apple Pay
                      </p>
                      <svg width="24" height="16" viewBox="0 0 32 20" fill="none"><path d="M0 10c0-5.5 4.5-10 10-10h12c5.5 0 10 4.5 10 10s-4.5 10-10 10H10C4.5 20 0 15.5 0 10zm4 0c0 3.3 2.7 6 6 6h12c3.3 0 6-2.7 6-6s-2.7-6-6-6H10c-3.3 0-6 2.7-6 6z" fill="white" opacity="0.8" /></svg>
                    </div>
                    <h3 className="font-display font-black text-4xl mb-1 m-0 tracking-tight drop-shadow-md relative z-10">Suica</h3>
                    <p className="font-mono text-sm opacity-90 m-0 tracking-wider relative z-10">¥ 12,450</p>
                  </div>

                  {/* Tech Grid Background Panel */}
                  <div className="bg-[#121214]/80 backdrop-blur-md p-4 rounded-3xl border border-white/5 relative overflow-hidden mt-2">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                    <div className="relative z-10">
                      <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-3 m-0">Live Converter</p>
                      <div className="flex justify-between items-center bg-black/50 p-3 rounded-2xl mb-2 border border-white/5">
                        <span className="text-lg font-black tracking-tight">🇺🇸 10.00</span>
                        <span className="text-white/30 text-xs font-bold">USD</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#E02424]/10 p-3 rounded-2xl border border-[#E02424]/40">
                        <span className="text-lg font-black text-[#E02424] tracking-tight">🇯🇵 1,485</span>
                        <span className="text-[#E02424]/60 text-xs font-bold">JPY</span>
                      </div>
                    </div>

                    <div className="mt-2 bg-[#121214]/80 backdrop-blur-md p-4 rounded-3xl border border-white/5 flex items-center justify-between shadow-lg">
                      <div>
                        <h4 className="font-bold text-sm tracking-tight m-0">7-Eleven ATM</h4>
                        <span className="text-[10px] text-white/50 font-bold m-0 tracking-widest uppercase">120m away automatically</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#E02424]/20 flex items-center justify-center border border-[#E02424]/50">
                        📍
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Safety & Travel Section */}
        <section id="safety" className="relative z-10 py-24 lg:py-32 px-6 lg:px-16 border-t border-white/20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse items-center justify-between gap-16 relative z-10">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <h2 className="font-display font-medium text-5xl lg:text-7xl tracking-tighter leading-tight m-0 text-white">Safety & <br /><span className="text-[#E02424] font-black italic">Travel</span></h2>
              <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-xl mx-auto lg:mx-0 m-0 font-medium">
                Live embassy updates, instant emergency dialing, local health tips, and customized transit strategies all in one place. Never feel lost in translation.
              </p>
            </div>
            <div className="flex-1 w-full max-w-lg mx-auto relative group">
              <div className="absolute inset-0 bg-[#E02424]/10 blur-3xl rounded-full group-hover:bg-[#E02424]/20 transition-colors"></div>
              <div className="aspect-[4/3] rounded-sm bg-black/60 border border-white/10 backdrop-blur-md relative overflow-hidden flex items-center justify-center p-8 transition-transform group-hover:scale-105 duration-500">
                <div className="absolute inset-0 border border-white/5 m-4"></div>
                <div className="text-center relative z-10">
                  <span className="block mb-6 text-white/80"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></span>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#E02424] mb-3">Emergency Hub</p>
                  <h4 className="font-display text-3xl text-white font-medium tracking-tight">Active Pulse Monitoring</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Food Section */}
        <section id="food" className="relative z-10 py-24 lg:py-32 px-6 lg:px-16 border-t border-white/20 bg-[#060608]/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <h2 className="font-display font-medium text-5xl lg:text-7xl tracking-tighter leading-tight m-0 text-white">Curated <br /><span className="text-white border-b-2 border-[#E02424] pb-3 block mt-2 max-w-max font-black mx-auto lg:mx-0">Food Discoveries</span></h2>
              <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-xl mx-auto lg:mx-0 m-0 font-medium pt-4">
                From hunting down hidden gem izakayas to exploring the endless aisles of local convenience stores. Explore interactive menus with built-in translations perfectly mapped before you even order.
              </p>
            </div>
            <div className="flex-1 w-full max-w-lg mx-auto relative group cursor-pointer">
              <div className="aspect-[4/3] rounded-sm bg-black/60 border border-white/10 backdrop-blur-md relative overflow-hidden p-6 flex flex-col justify-between transition-transform group-hover:-translate-y-2 duration-500 hover:shadow-[0_20px_40px_rgba(224,36,36,0.15)]">
                <div className="w-full h-48 bg-white/5 overflow-hidden mb-5 relative border border-white/5">
                  <img src="https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover opacity-60 filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="flex justify-between items-end border-t border-white/10 pt-5">
                  <div>
                    <h4 className="font-bold text-white text-xl font-display mb-1.5 tracking-tight">Sushi Zanmai Honten</h4>
                    <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase m-0">9.4km • Tsukiji Market</p>
                  </div>
                  <span className="text-[#E02424] font-bold tracking-widest bg-[#E02424]/10 px-3 py-1 rounded-sm border border-[#E02424]/30">¥¥¥</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Study Abroad Outro */}
        <section className="relative z-10 w-full py-32 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto border-t border-white/20">
          <h2 className="font-display font-medium text-4xl sm:text-6xl tracking-tight mb-12">Study Abroad with OU.</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/sign-up" className="inline-flex px-12 py-5 bg-[#E02424] text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-red-700 transition-colors shadow-2xl w-full sm:w-auto overflow-hidden justify-center items-center">
              Sign Up
            </Link>
            <Link href="/login" className="inline-flex px-12 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white/20 transition-colors shadow-2xl w-full sm:w-auto justify-center items-center">
              Sign In
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-16 px-6 text-center flex flex-col items-center justify-center border-t border-white/10">
          <p className="font-display font-black text-2xl sm:text-3xl text-white mb-3 tracking-[0.15em] m-0 uppercase">OUStudyJapan.</p>
          <div className="w-8 h-[2px] bg-white/30 mb-6"></div>
          <p className="text-white/30 text-[9px] font-bold tracking-[0.2em] uppercase m-0">© 2026 University of Oklahoma Study Abroad</p>
        </footer>
      </div>
    </>
  )
}
