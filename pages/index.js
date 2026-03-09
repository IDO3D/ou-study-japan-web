// pages/index.js — Cinematic Landing Page
import Head from 'next/head'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// =========================================================================
// TO EDIT THE BACKGROUND VIDEO:
// Simply upload an unlisted or public 4K video to YouTube and paste its ID below.
// Example: URL is https://youtube.com/watch?v=dQw4w9WgXcQ -> ID is "dQw4w9WgXcQ"
// =========================================================================
const YOUTUBE_BACKGROUND_ID = "F3zks8sLzYI"

const FEATURES = [
  { icon: '🗾', title: 'Interactive Route Map', desc: 'Seamlessly navigate through Ibaraki, Kyoto, and Tokyo. Live updates and curated points of interest.' },
  { icon: '💳', title: 'Digital Suica Wallet', desc: 'Manage your transit card, convert USD to JPY instantly, and locate the nearest foreign-friendly ATMs.' },
  { icon: '🏥', title: 'Health & Safety Hub', desc: 'Direct emergency dials, local hospital routes, and translated medical phrasing for instant peace of mind.' },
  { icon: '🍜', title: 'Curated Food Discover', desc: 'Browse curated convenience store grabs to authentic local izakayas. Read menus before you arrive.' },
  { icon: '📸', title: 'Cinematic Photo Reel', desc: 'Compile your study abroad journey. Add captions and let the app build an autoplaying cinematic memory.' },
  { icon: '⭐', title: 'Points & Quests', desc: 'Engage with local culture through gamified challenges and earn rewards while discovering Japan.' },
]

export default function LandingPage() {
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
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-8 lg:px-16 w-full mix-blend-difference">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5">
              <div className="w-full h-full bg-[#E02424] rounded-full"></div>
            </div>
            <span className="font-display font-black text-white tracking-[0.15em] text-xs uppercase hidden sm:block">OUStudyJapan.</span>
          </div>

          {/* Center Links (Desktop only) */}
          <div className="hidden md:flex items-center gap-12 font-medium text-[10px] uppercase tracking-[0.2em] text-white/70">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#wallet" className="hover:text-white transition-colors">Wallet</Link>
            <Link href="#safety" className="hover:text-white transition-colors">Safety</Link>
            <Link href="#food" className="hover:text-white transition-colors">Food</Link>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-8">
            <Link href="/login" className="hidden sm:block text-[10px] font-bold text-white tracking-[0.2em] uppercase hover:text-white/70 transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="text-white hover:text-white/70 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </Link>
          </div>
        </nav>

        {/* Cinematic Hero Section */}
        <section ref={heroRef} className="relative min-h-screen w-full flex items-center bg-[#09090b] overflow-hidden pt-24 pb-16">
          {/* Animated Background Reel */}
          <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Mobile Fallback Image / Poster */}
            <img src="https://images.unsplash.com/photo-1542051842920-84a48ed9c4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60 block md:hidden scale-105" />

            {/* YouTube Embed Background */}
            <div className="hidden md:block absolute inset-0 w-[400vw] h-[400vh] -top-[150vh] -left-[150vw] sm:w-[150vw] sm:h-[150vh] sm:-top-[25vh] sm:-left-[25vw]">
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_BACKGROUND_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${YOUTUBE_BACKGROUND_ID}&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
                allow="autoplay; fullscreen; picture-in-picture"
                className="w-full h-full object-cover opacity-50 pointer-events-none mix-blend-screen scale-110"
              />
            </div>
            {/* Dark moody gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </motion.div>

          {/* Left Vertical Indicator */}
          <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-20 mix-blend-difference hidden md:flex">
            <span className="text-[9px] font-bold text-white tracking-widest">01</span>
            <div className="w-[1px] h-32 bg-white/20 relative">
              <motion.div style={{ height: useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]) }} className="absolute top-0 left-0 w-full bg-white"></motion.div>
            </div>
            <span className="text-[9px] font-bold text-white/50 tracking-widest">03</span>
          </div>

          {/* Bottom Left Socials */}
          <div className="absolute bottom-10 left-6 lg:left-12 items-center gap-8 z-20 text-[10px] font-bold text-white tracking-widest mix-blend-difference hidden md:flex">
            <a href="#" className="hover:text-white/70 transition-colors">Fb.</a>
            <a href="#" className="hover:text-white/70 transition-colors">Tw.</a>
            <a href="#" className="hover:text-white/70 transition-colors">In.</a>
          </div>

          {/* Bottom Right Card (Matches JTRIP) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-10 right-6 lg:right-16 z-20 w-[340px] bg-[#0c0c0e]/80 backdrop-blur-md p-6 flex items-center gap-5 hidden lg:flex hover:bg-black transition-colors cursor-pointer group shadow-2xl border border-white/5"
          >
            <div className="flex-1">
              <div className="flex gap-1.5 mb-4">
                <div className="w-4 h-[2px] bg-white"></div>
                <div className="w-1 h-[2px] bg-white/30"></div>
                <div className="w-1 h-[2px] bg-white/30"></div>
                <div className="w-1 h-[2px] bg-white/30"></div>
              </div>
              <p className="text-sm font-bold text-white leading-snug pr-2 mb-2">5 best places to visit in Japan.</p>
              <span className="text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                More <span className="text-[#E02424] text-lg leading-none">→</span>
              </span>
            </div>
            <div className="w-28 h-20 bg-white/5 overflow-hidden relative rounded-sm group-hover:scale-105 transition-transform">
              <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Main Hero Content (Left Aligned) */}
          <div className="relative z-10 w-full px-6 md:px-32 lg:px-44">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-display font-medium text-white leading-[1.1] tracking-tight mb-8 text-shadow-xl"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            >
              Capture Your <br className="hidden sm:block" />
              Japan Story.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex items-center gap-5 mb-12"
            >
              <button className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all group backdrop-blur-sm shadow-xl">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-1.5 group-hover:scale-110 transition-transform"><path d="M5 3l14 9-14 9V3z" /></svg>
              </button>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 mb-1.5">See video</p>
                <p className="text-xs uppercase font-bold tracking-[0.1em] text-white">OU STUDY ABROAD 2026</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Link href="/sign-up" className="inline-block px-12 py-5 bg-[#E02424] text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-red-700 transition-colors shadow-xl">
                Explore
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Cinematic Features Grid */}
        <section className="relative z-20 bg-[#060608] py-24 sm:py-32 px-6 lg:px-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 sm:mb-24 text-center sm:text-left max-w-3xl">
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 mt-0">Designed for <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E02424] to-red-400">Discovery.</span></h2>
              <p className="text-lg sm:text-xl text-white/50 leading-relaxed font-medium">We stripped away the clutter to give you exactly what you need while standing on the streets of Tokyo, Kyoto, or Ibaraki.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="rounded-3xl p-8 sm:p-10 bg-[#121214] border border-white/5 hover:border-white/20 transition-all hover:-translate-y-2 group relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#E02424]/20 transition-colors"></div>
                  <span className="text-5xl block mb-6 filter drop-shadow-md">{f.icon}</span>
                  <h3 className="font-display font-black text-xl sm:text-2xl mb-4 tracking-tight group-hover:text-[#E02424] transition-colors m-0">{f.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm sm:text-base font-medium m-0">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Wallet Visual Break-out Section */}
        <section className="bg-black py-24 px-6 lg:px-12 relative overflow-hidden border-t border-white/5">
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

        {/* Cinematic Photo Reel Outro */}
        <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden border-t border-white/10">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1542051842920-84a48ed9c4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Japan" className="w-full h-full object-cover scale-105 opacity-50 filter grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight mb-6">Build your reel.</h2>
            <p className="text-lg sm:text-xl text-white/50 leading-relaxed font-medium mb-10">Upload photos, add context, and let the app build a cinematic memory of your semester studying abroad.</p>
            <Link href="/sign-up" className="inline-flex px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-2xl">
              Start Your OU Japan Journey
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-16 px-6 border-t border-white/10 text-center flex flex-col items-center justify-center">
          <p className="font-display font-black text-2xl sm:text-3xl text-white mb-3 tracking-tight m-0">OUStudyJapan</p>
          <div className="w-12 h-1 bg-[#E02424] rounded-full mb-6"></div>
          <p className="text-white/30 text-sm font-semibold tracking-wide uppercase m-0">© 2026 University of Oklahoma Study Abroad</p>
        </footer>
      </div>
    </>
  )
}
