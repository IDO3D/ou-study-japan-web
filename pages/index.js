// pages/index.js — Cinematic Landing Page
import Head from 'next/head'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

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

        {/* Navigation - Glassmorphism */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E02424] to-red-600 flex items-center justify-center font-black text-white shadow-lg shadow-[#E02424]/20">
              JP
            </div>
            <span className="font-display font-black text-xl tracking-tight hidden sm:block">OUStudyJapan</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-white/70 hover:text-white transition-colors hidden sm:block">
              Welcome Back
            </Link>
            <Link href="/sign-up" className="text-sm font-bold px-6 py-2.5 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              Enter Portal
            </Link>
          </div>
        </nav>

        {/* Cinematic Hero Section */}
        <section ref={heroRef} className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden">
          {/* Animated Background Reel */}
          <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105 opacity-80"
              poster="https://images.unsplash.com/photo-1542051842920-84a48ed9c4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            >
              {/* High-quality cinematic Tokyo intersection video */}
              <source src="https://assets.mixkit.co/videos/preview/mixkit-timelapse-of-a-busy-intersection-in-tokyo-4100-large.mp4" type="video/mp4" />
            </video>
            {/* Vignette and Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black"></div>
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-[10px] sm:text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 uppercase tracking-widest text-white/90 shadow-2xl shadow-black/50">
                <span className="w-2 h-2 rounded-full bg-[#E02424] animate-pulse"></span>
                University of Oklahoma Study Abroad
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-display font-black text-white leading-[1.05] tracking-tighter mb-6 filter drop-shadow-2xl"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 8rem)' }}
            >
              Capture Your<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-100 via-white to-[#E02424] pr-4">
                Japan Story.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-base sm:text-lg lg:text-2xl font-medium text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-sm"
            >
              The ultimate cinematic companion for your journey. Maps, digital wallet, survival phrasing, immersive food guides, and your personal photo reel.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-[#E02424] text-white font-bold text-lg sm:text-xl transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(224,36,36,0.6)] group">
                Begin Your Journey
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
            <span className="text-[10px] tracking-widest uppercase font-bold text-white/50">Explore Below</span>
            <div className="text-xl mt-2 text-center">↓</div>
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
                className="aspect-[9/19] rounded-[3rem] border-[10px] border-zinc-800 bg-[#0a0a0c] relative overflow-hidden shadow-2xl shadow-[#E02424]/20"
              >
                {/* iPhone Notch */}
                <div className="absolute top-0 inset-x-0 h-7 bg-zinc-800 rounded-b-3xl w-40 mx-auto z-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#18181b] to-black"></div>

                {/* Mock Phone UI */}
                <div className="relative z-10 p-5 pt-16 flex flex-col gap-4">
                  <div className="bg-black text-white p-6 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                    <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2 font-bold m-0">Apple Pay Ready</p>
                    <h3 className="font-display font-black text-3xl mb-1 m-0 tracking-tight">Suica</h3>
                    <p className="font-mono text-xs opacity-60 m-0">**** **** 1234 5678</p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-3xl border border-white/10 mt-2">
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

                  <div className="mt-2 bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm tracking-tight m-0">7-Eleven ATM</h4>
                      <span className="text-[10px] text-white/50 font-bold m-0 tracking-widest uppercase">120m away automatically</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#E02424]/20 flex items-center justify-center border border-[#E02424]/50">
                      📍
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
