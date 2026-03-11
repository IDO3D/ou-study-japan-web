import Head from 'next/head'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const TESTIMONIES = [
    {
        id: 1,
        name: "Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        quote: '"Kyoto feels like home. The absolute best semester of my life!"',
        story: "Walking through the torii gates of Fushimi Inari at dawn, before the city wakes up, is an experience I'll never forget. My study abroad program at OU didn't just teach me the language—it completely changed how I see the world. From late-night ramen runs with my host family to navigating the bullet trains, every single day was a cinematic adventure.",
        likes: 124,
        comments: 12,
        location: "Kyoto University",
        date: "Fall 2025"
    },
    {
        id: 2,
        name: "David Chen",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        quote: '"The tech scene in Tokyo is unmatched. An incredible learning curve."',
        story: "As a computer science major, being placed in the heart of Shibuya was mind-blowing. The blend of ultra-modern technology with deep-rooted tradition is something you have to experience to understand. I got to visit robotics labs, arcade centers, and neon-lit alleyways. I built lifelong friendships and professional connections that I still use today.",
        likes: 342,
        comments: 45,
        location: "Tokyo Tech",
        date: "Spring 2026"
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        quote: '"Osaka\'s food culture ruined me in the best way possible."',
        story: "They say Osaka is the kitchen of Japan, and it's true. My semester wasn't just about studying global business; it was about connecting with people through food. Dotonbori at night, eating fresh takoyaki and okonomiyaki while the neon lights hit the river—it's pure magic. The OU study abroad support system made settling in completely seamless.",
        likes: 89,
        comments: 5,
        location: "Osaka Central",
        date: "Summer 2025"
    }
]

export default function TestimoniesPage() {
    const containerRef = useRef(null)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <Head>
                <title>OUStudyJapan — Student Stories</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>

            <div className="bg-[#050505] min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#E02424] selection:text-white" ref={containerRef}>

                {/* Navigation - Identical to Landing */}
                <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 lg:px-16 w-full transition-all duration-500 max-w-[100vw] ${isScrolled ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 py-4 sm:py-5 shadow-2xl' : 'backdrop-blur-md bg-black/30 border-b border-white/5 py-6 sm:py-8'}`}>
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center p-1 sm:p-1.5 transition-transform group-hover:scale-105">
                            <div className="w-full h-full bg-[#E02424] rounded-full"></div>
                        </div>
                        <span className="font-display font-black text-white tracking-[0.1em] sm:tracking-[0.15em] text-[10px] sm:text-xs uppercase group-hover:text-white/80 transition-colors">OUStudyJapan.</span>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-8">
                        <Link href="/" className="text-[10px] font-bold text-white tracking-[0.2em] uppercase hover:text-white/70 transition-colors">
                            <span className="hidden sm:inline">Back to </span>Home
                        </Link>
                        <Link href="/sign-up" className="border border-[#E02424]/50 bg-[#E02424]/10 px-6 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase hover:bg-[#E02424] hover:text-white transition-colors backdrop-blur-sm">
                            Apply Now
                        </Link>
                    </div>
                </nav>

                {/* Hero Banner for Blog */}
                <header className="relative pt-40 pb-16 px-6 lg:px-16 border-b border-white/5 bg-black overflow-hidden flex items-center justify-center min-h-[50vh]">
                    {/* Ambient Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#E02424] opacity-[0.08] blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 text-center max-w-2xl mx-auto mt-10">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                            className="px-4 py-1.5 rounded-full border border-[#E02424] text-[#E02424] text-[10px] font-bold uppercase tracking-widest inline-block mb-6 shadow-[0_0_20px_rgba(224,36,36,0.2)]"
                        >
                            Student Success Hub
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                            className="font-display font-medium text-4xl sm:text-6xl tracking-tight mb-6 leading-[1.1]"
                        >
                            Real Stories. <br className="hidden sm:block" /><span className="italic text-white/50">Real Japan.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
                            className="text-white/50 text-sm sm:text-base leading-relaxed"
                        >
                            Explore firsthand accounts from OU scholars completing their global journey across Japan's most immersive universities and vibrant cities.
                        </motion.p>
                    </div>
                </header>

                {/* Testimonies Feed */}
                <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12 sm:space-y-20 relative z-10">
                    {TESTIMONIES.map((testimony, i) => (
                        <motion.article
                            key={testimony.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.7, delay: i * 0.1 }}
                            className="group"
                        >
                            {/* Author Header */}
                            <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/10 overflow-hidden shadow-lg group-hover:border-white/30 transition-colors">
                                    <img src={testimony.image} alt={testimony.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-sm sm:text-base tracking-tight">{testimony.name}</h3>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">{testimony.location} • {testimony.date}</p>
                                </div>
                            </div>

                            {/* Main Content Box (Cinematic Glassmorphism) */}
                            <div className="bg-[#111113]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-white/15 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                                {/* Subtle background gradient on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                {/* Quote Banner */}
                                <div className="mb-6 border-l-2 border-[#E02424] pl-5 py-1 relative z-10">
                                    <p className="font-display text-xl sm:text-2xl font-medium text-white/90 leading-snug">
                                        {testimony.quote}
                                    </p>
                                </div>

                                {/* Body */}
                                <p className="text-white/60 font-body text-sm sm:text-base leading-relaxed mb-8 relative z-10">
                                    {testimony.story}
                                </p>

                                {/* Interactive Action Bar */}
                                <div className="flex items-center gap-6 sm:gap-8 text-white/50 border-t border-white/10 pt-6 relative z-10">
                                    <button className="flex items-center gap-2 hover:text-[#E02424] group/btn transition-colors active:scale-95 cursor-pointer">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/btn:fill-[#E02424]/20 group-hover/btn:stroke-[#E02424]">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                        <span className="text-xs font-bold tracking-wide">{testimony.likes}</span>
                                    </button>

                                    <button className="flex items-center gap-2 hover:text-white transition-colors active:scale-95 group/btn cursor-pointer">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/btn:fill-white/10">
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                        </svg>
                                        <span className="text-xs font-bold tracking-wide">{testimony.comments}</span>
                                    </button>

                                    <button className="flex items-center gap-2 hover:text-white transition-colors active:scale-95 ml-auto group/btn cursor-pointer">
                                        <span className="text-[10px] tracking-widest uppercase font-bold hidden sm:inline opacity-0 group-hover/btn:opacity-100 transition-opacity">Share</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/btn:fill-white/10">
                                            <circle cx="18" cy="5" r="3"></circle>
                                            <circle cx="6" cy="12" r="3"></circle>
                                            <circle cx="18" cy="19" r="3"></circle>
                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </main>
            </div>
        </>
    )
}
