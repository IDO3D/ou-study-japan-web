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

        // Check if tutorial completed
        const { data: profile } = await supabase
            .from('profiles')
            .select('tutorial_completed, name')
            .eq('id', data.user.id)
            .single()

        toast.success(`Welcome back${profile?.name ? `, ${profile.name}` : ''}! 🎌`)

        if (profile && !profile.tutorial_completed) {
            router.push('/tutorial')
        } else {
            router.push('/dashboard')
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
            },
        })
        if (error) toast.error(error.message)
    }

    return (
        <>
            <Head>
                <title>Sign In — OUStudyJapan</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(224,36,36,0.08) 0%, transparent 60%), #09090b' }}>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm"
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/">
                            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl font-black text-white cursor-pointer"
                                style={{ background: 'linear-gradient(135deg, #E02424, #FF8E53)', boxShadow: '0 8px 24px rgba(224,36,36,0.4)' }}>
                                JP
                            </div>
                        </Link>
                        <h1 className="text-2xl font-display font-black text-white tracking-tight">Welcome back</h1>
                        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Sign in to your OUStudyJapan account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-3">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            className="input-field"
                            autoComplete="email"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                            className="input-field"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-2xl font-display font-bold text-white transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                            style={{ background: '#E02424', boxShadow: '0 4px 16px rgba(224,36,36,0.4)' }}
                        >
                            {loading ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : '→ Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <span className="text-[10px] font-display font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>OR</span>
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    </div>

                    {/* Google */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-3.5 rounded-2xl font-display font-semibold text-sm flex items-center justify-center gap-3 transition-all active:scale-95"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <span className="text-lg">G</span> Continue with Google
                    </button>

                    {/* Footer */}
                    <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        No account?{' '}
                        <Link href="/sign-up" className="font-bold" style={{ color: '#FF6B6B' }}>
                            Create one free
                        </Link>
                    </p>
                </motion.div>
            </div>
        </>
    )
}
