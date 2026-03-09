// pages/index.js — Landing Page
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '🗾', title: 'Interactive Map', desc: 'Explore Ibaraki, Kyoto & Tokyo with live navigation and POI discovery.' },
  { icon: '💴', title: 'Digital Wallet', desc: 'Manage your Suica card, convert USD to JPY, find ATMs instantly.' },
  { icon: '🏥', title: 'Health & Safety', desc: 'Emergency hospitals, allergy cards in Japanese, document storage.' },
  { icon: '🍜', title: 'Food Discovery', desc: 'Find authentic restaurants, filter by cuisine, translate menus.' },
  { icon: '⭐', title: 'Quests & Rewards', desc: 'Earn points for cultural experiences and complete challenges.' },
  { icon: '📸', title: 'Photo Reel', desc: 'Compile your trip highlights into a cinematic memory reel.' },
]

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>OUStudyJapan — Study Abroad Companion</title>
        <meta name="description" content="The essential companion app for OU students studying abroad in Japan." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#09090b" />
      </Head>

      <div className="min-h-screen" style={{ background: '#09090b' }}>
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white"
              style={{ background: 'linear-gradient(135deg, #E02424, #FF8E53)' }}>
              JP
            </div>
            <span className="font-display font-black text-white text-lg tracking-tight">OUStudyJapan</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-display font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              Sign In
            </Link>
            <Link href="/sign-up" className="text-sm font-display font-bold px-5 py-2 rounded-xl text-white transition-all active:scale-95"
              style={{ background: '#E02424', boxShadow: '0 4px 16px rgba(224,36,36,0.4)' }}>
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="px-6 pt-16 pb-20 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-display font-bold"
              style={{ background: 'rgba(224,36,36,0.12)', border: '1px solid rgba(224,36,36,0.25)', color: '#FF8E8E' }}>
              🇯🇵 University of Oklahoma · Study Abroad Program
            </div>

            <h1 className="font-display font-black text-white leading-none tracking-tighter mb-6"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
              Your Japan<br />
              <span style={{ background: 'linear-gradient(135deg, #FF6B6B, #E02424, #FF8E53)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Study Companion
              </span>
            </h1>

            <p className="text-lg leading-relaxed mx-auto max-w-2xl mb-10"
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              Maps, budgeting, health resources, food discovery, and rewards — everything you need for 24 nights across Ibaraki, Kyoto, and Tokyo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sign-up"
                className="px-8 py-4 rounded-2xl font-display font-bold text-white text-base transition-all active:scale-95"
                style={{ background: '#E02424', boxShadow: '0 8px 30px rgba(224,36,36,0.4)' }}>
                Create Free Account →
              </Link>
              <Link href="/login"
                className="px-8 py-4 rounded-2xl font-display font-bold text-base transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)' }}>
                Sign In
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-3xl"
                style={{ background: 'rgba(18,18,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-display font-bold text-white mt-3 mb-1">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pb-10">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © 2026 OUStudyJapan · University of Oklahoma Study Abroad Program
          </p>
        </footer>
      </div>
    </>
  )
}
