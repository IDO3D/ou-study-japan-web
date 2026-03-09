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

            <div className="min-h-screen flex items-center justify-center px-5 py-10"
                style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(224,36,36,0.08) 0%, transparent 60%), #09090b' }}>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/">
                            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl font-black text-white cursor-pointer"
                                style={{ background: 'linear-gradient(135deg, #E02424, #FF8E53)', boxShadow: '0 8px 24px rgba(224,36,36,0.4)' }}>
                                JP
                            </div>
                        </Link>
                        <h1 className="text-2xl font-display font-black text-white tracking-tight">
                            {step === 1 ? 'Create your account' : 'Academic profile'}
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {step === 1 ? 'Join the OU Japan experience' : 'Tell us about your program'}
                        </p>
                    </div>

                    {/* Step indicators */}
                    <div className="flex gap-2 mb-6">
                        {[1, 2].map(s => (
                            <div key={s} className="flex-1 h-1 rounded-full transition-all"
                                style={{ background: s <= step ? '#E02424' : 'rgba(255,255,255,0.1)' }} />
                        ))}
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleCredentials} className="space-y-3">
                            <input type="text" placeholder="Full Name" value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                className="input-field" autoComplete="name" required />
                            <input type="email" placeholder="Email (ou.edu preferred)" value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                className="input-field" autoComplete="email" required />
                            <input type="password" placeholder="Password (8+ characters)" value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                className="input-field" autoComplete="new-password" required />
                            <input type="password" placeholder="Confirm Password" value={form.confirmPassword}
                                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                className="input-field" autoComplete="new-password" required />
                            <button type="submit"
                                className="w-full py-3.5 rounded-2xl font-display font-bold text-white transition-all active:scale-95 mt-2"
                                style={{ background: '#E02424', boxShadow: '0 4px 16px rgba(224,36,36,0.4)' }}>
                                Continue →
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignUp} className="space-y-3">
                            <div>
                                <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>University</p>
                                <select value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                                    className="input-field" style={{ background: 'rgba(255,255,255,0.07)', color: 'white' }}>
                                    {UNIVERSITIES.map(u => <option key={u}>{u}</option>)}
                                </select>
                            </div>
                            <div>
                                <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Major</p>
                                <select value={form.major} onChange={e => setForm(f => ({ ...f, major: e.target.value }))}
                                    className="input-field" style={{ background: 'rgba(255,255,255,0.07)', color: 'white' }}>
                                    {MAJORS.map(m => <option key={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <p className="text-[10px] font-display font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Year</p>
                                <select value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                                    className="input-field" style={{ background: 'rgba(255,255,255,0.07)', color: 'white' }}>
                                    {YEARS.map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button type="button" onClick={() => setStep(1)}
                                    className="flex-1 py-3.5 rounded-2xl font-display font-bold text-sm transition-all active:scale-95"
                                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    ← Back
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-1 py-3.5 rounded-2xl font-display font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center"
                                    style={{ background: '#E02424', boxShadow: '0 4px 16px rgba(224,36,36,0.4)' }}>
                                    {loading ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : 'Create Account 🎌'}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold" style={{ color: '#FF6B6B' }}>Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </>
    )
}
