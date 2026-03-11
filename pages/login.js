// pages/login.js
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) { toast.error('Please fill in all fields'); return }
        setLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        // Always go to dashboard after login — dashboard handles tutorial check
        toast.success('Welcome back! 🎌')
        window.location.href = '/dashboard'
    }

    return (
        <>
            <Head>
                <title>Sign In — OUStudyJapan</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            {/* Animated Cinematic Background for ENTIRE PAGE */}
            <div className="fixed inset-0 z-0 bg-black pointer-events-none">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1542051842920-84a48ed9c4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-20 block md:hidden scale-105" />
                    <div className="hidden md:block absolute inset-0 w-[400vw] h-[400vh] -top-[150vh] -left-[150vw] sm:w-[150vw] sm:h-[150vh] sm:-top-[25vh] sm:-left-[25vw]">
                        <iframe
                            src={`https://www.youtube.com/embed/xXiSN8Tftjg?autoplay=1&mute=1&controls=0&loop=1&playlist=xXiSN8Tftjg&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
                            allow="autoplay; fullscreen; picture-in-picture"
                            className="w-full h-full object-cover opacity-50 pointer-events-none mix-blend-screen scale-110"
                        />
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
            </div>

            <div className="min-h-screen flex items-center justify-center px-6 py-10 relative z-10 w-full">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm bg-black/40 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-sm shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                    {/* subtle red ambient glow behind form */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#E02424]/10 rounded-full blur-3xl group-hover:bg-[#E02424]/20 transition-colors pointer-events-none"></div>

                    {/* Logo */}
                    <div className="text-center mb-10">
                        <Link href="/" className="flex items-center justify-center gap-2 sm:gap-3 mb-6 mx-auto w-max cursor-pointer">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center p-1 font-bold">
                                <div className="w-full h-full bg-[#E02424] rounded-full"></div>
                            </div>
                            <span className="font-display font-black text-white tracking-[0.1em] text-[9px] uppercase">OUStudyJapan.</span>
                        </Link>
                        <h1 className="text-3xl font-display font-medium text-white tracking-tight mb-2">Welcome back.</h1>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Sign in to your portal</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4 relative z-10">
                        <div>
                            <input
                                type="email"
                                placeholder="Email address"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-5 py-4 text-sm focus:outline-none focus:border-white/40 transition-colors rounded-sm"
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-5 py-4 text-sm focus:outline-none focus:border-white/40 transition-colors rounded-sm"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-2 bg-[#E02424] text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-red-700 transition-colors shadow-2xl disabled:opacity-50 flex items-center justify-center rounded-sm"
                        >
                            {loading
                                ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-[10px] font-bold tracking-[0.1em] uppercase text-white/40 mt-8 relative z-10">
                        No account?{' '}
                        <Link href="/sign-up" className="text-white hover:text-white/70 transition-colors ml-1">
                            Create one free
                        </Link>
                    </p>
                </motion.div>
            </div>
        </>
    )
}
