// pages/sign-up.js
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

const UNIVERSITIES = ['University of Oklahoma', 'OU Health Sciences', 'Cameron University', 'Other']
const MAJORS = ['Marketing', 'Business Administration', 'International Business', 'Finance', 'Management', 'Other']
const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']

export default function SignUpPage() {
    const router = useRouter()
    const [step, setStep] = useState(1) // 1 = credentials, 2 = academic info
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        university: 'University of Oklahoma', major: 'Marketing', year: 'Junior',
    })
    const [loading, setLoading] = useState(false)

    const handleCredentials = (e) => {
        e.preventDefault()
        if (!form.name) { toast.error('Please enter your name'); return }
        if (!form.email.includes('@')) { toast.error('Please enter a valid email'); return }
        if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
        if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
        setStep(2)
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Create auth account
        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: { name: form.name },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        if (data.user) {
            // Upsert profile (trigger also creates it, this ensures extra fields are set)
            await supabase.from('profiles').upsert({
                id: data.user.id,
                name: form.name,
                email: form.email,
                university: form.university,
                major: form.major,
                year: form.year,
                tutorial_completed: false,
                points: 0,
                daily_budget_jpy: 4500,
            })

            toast.success(`Welcome, ${form.name}! 🎌 Let's get you started.`)
            router.push('/tutorial')
        }

        setLoading(false)
    }

    return (
        <>
            <Head>
                <title>Create Account — OUStudyJapan</title>
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
                    <div className="text-center mb-8 relative z-10">
                        <Link href="/" className="flex items-center justify-center gap-2 sm:gap-3 mb-6 mx-auto w-max cursor-pointer">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center p-1 font-bold">
                                <div className="w-full h-full bg-[#E02424] rounded-full"></div>
                            </div>
                            <span className="font-display font-black text-white tracking-[0.1em] text-[9px] uppercase">OUStudyJapan.</span>
                        </Link>
                        <h1 className="text-3xl font-display font-medium text-white tracking-tight mb-2">
                            {step === 1 ? 'Create account.' : 'Academic info.'}
                        </h1>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
                            {step === 1 ? 'Join the experience' : 'Tell us about your program'}
                        </p>
                    </div>

                    {/* Step indicators */}
                    <div className="flex gap-2 mb-8 relative z-10">
                        {[1, 2].map(s => (
                            <div key={s} className="flex-1 h-[2px] rounded-full transition-all"
                                style={{ background: s <= step ? '#E02424' : 'rgba(255,255,255,0.1)' }} />
                        ))}
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleCredentials} className="space-y-4 relative z-10">
                            <input type="text" placeholder="Full Name" value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-5 py-4 text-sm focus:outline-none focus:border-white/40 transition-colors rounded-sm" autoComplete="name" required />
                            <input type="email" placeholder="Email (ou.edu preferred)" value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-5 py-4 text-sm focus:outline-none focus:border-white/40 transition-colors rounded-sm" autoComplete="email" required />
                            <input type="password" placeholder="Password (8+ chars)" value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-5 py-4 text-sm focus:outline-none focus:border-white/40 transition-colors rounded-sm" autoComplete="new-password" required />
                            <input type="password" placeholder="Confirm Password" value={form.confirmPassword}
                                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-5 py-4 text-sm focus:outline-none focus:border-white/40 transition-colors rounded-sm" autoComplete="new-password" required />
                            <button type="submit"
                                className="w-full py-4 mt-2 bg-[#E02424] text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-red-700 transition-colors shadow-2xl rounded-sm">
                                Continue →
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignUp} className="space-y-4 relative z-10">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">University</p>
                                <select value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-4 text-sm focus:outline-none focus:border-white/40 transition-colors rounded-sm appearance-none">
                                    {UNIVERSITIES.map(u => <option key={u} className="bg-black text-white">{u}</option>)}
                                </select>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">Major</p>
                                <select value={form.major} onChange={e => setForm(f => ({ ...f, major: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-4 text-sm focus:outline-none focus:border-white/40 transition-colors rounded-sm appearance-none">
                                    {MAJORS.map(m => <option key={m} className="bg-black text-white">{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">Year</p>
                                <select value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-4 text-sm focus:outline-none focus:border-white/40 transition-colors rounded-sm appearance-none">
                                    {YEARS.map(y => <option key={y} className="bg-black text-white">{y}</option>)}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setStep(1)}
                                    className="flex-[0.5] py-4 bg-white/5 border border-white/10 text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white/10 transition-colors rounded-sm text-center">
                                    Back
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-1 py-4 bg-[#E02424] text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-red-700 transition-colors shadow-2xl disabled:opacity-50 flex items-center justify-center rounded-sm">
                                    {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-[10px] font-bold tracking-[0.1em] uppercase text-white/40 mt-8 relative z-10">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:text-white/70 transition-colors ml-1">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </>
    )
}
