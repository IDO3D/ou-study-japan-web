// pages/tutorial.js — Onboarding flow (shown once per user)
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

const STEPS = [
    {
        id: 1,
        icon: '🎌',
        title: 'Welcome to OUStudyJapan',
        subtitle: '24 nights across 3 incredible cities',
        body: "You're about to experience Ibaraki, Kyoto, and Tokyo through an immersive study abroad program. This app is your all-in-one companion for navigation, budgeting, health, and cultural discovery.",
        highlight: 'OU · Japan Program · 2026',
        color: '#E02424',
    },
    {
        id: 2,
        icon: '🗾',
        title: 'Explore with Live Maps',
        subtitle: 'Ibaraki · Kyoto · Tokyo',
        body: 'Navigate each city with interactive 3D maps showing restaurants, transit stations, cultural sites, and your housing. Switch between cities and filter POIs by type.',
        highlight: 'Map Explorer → Filter by Category',
        color: '#4F46E5',
    },
    {
        id: 3,
        icon: '💴',
        title: 'Manage Your Money',
        subtitle: 'Suica card, ATMs & currency converter',
        body: 'Track your Suica IC card balance, find the nearest international ATMs, convert USD to JPY instantly, and follow our daily budget template to make every yen count.',
        highlight: '¥4,500 recommended daily budget',
        color: '#10B981',
    },
    {
        id: 4,
        icon: '⭐',
        title: 'Earn Rewards & Complete Quests',
        subtitle: 'Turn experiences into points',
        body: 'Complete cultural challenges — visit a shrine, try a new dish, ride the Shinkansen — and earn points toward exclusive rewards and achievements.',
        highlight: 'You start with 0 points. Get exploring!',
        color: '#F59E0B',
    },
    {
        id: 5,
        icon: '🚀',
        title: "You're All Set!",
        subtitle: 'Japan awaits you',
        body: "Your profile is ready, your map is loaded, and your adventure starts now. Navigate using the bottom bar on mobile or the sidebar on desktop. Safe travels! がんばれ！",
        highlight: 'Tap "Enter Dashboard" to begin →',
        color: '#E02424',
    },
]

export default function TutorialPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [completing, setCompleting] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) { router.push('/login'); return }
            setUser(user)
        })
    }, [])

    const current = STEPS[step]
    const isLast = step === STEPS.length - 1

    const completeTutorial = async () => {
        if (!user) return
        setCompleting(true)

        const { error } = await supabase
            .from('profiles')
            .update({ tutorial_completed: true })
            .eq('id', user.id)

        if (error) {
            toast.error('Something went wrong. Please try again.')
            setCompleting(false)
            return
        }

        toast.success('Setup complete! Welcome to Japan 🎌')
        router.push('/dashboard')
    }

    return (
        <>
            <Head>
                <title>Getting Started — OUStudyJapan</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(224,36,36,0.1) 0%, transparent 60%), #09090b' }}>

                {/* Progress bar */}
                <div className="w-full max-w-md mb-8">
                    <div className="flex gap-1.5">
                        {STEPS.map((s, i) => (
                            <div key={s.id} className="flex-1 h-1 rounded-full transition-all duration-500"
                                style={{ background: i <= step ? current.color : 'rgba(255,255,255,0.1)' }} />
                        ))}
                    </div>
                    <p className="text-[10px] font-display font-bold mt-2 text-right"
                        style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Step {step + 1} of {STEPS.length}
                    </p>
                </div>

                {/* Step card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 30, scale: 0.97 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -30, scale: 0.97 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-md"
                    >
                        <div className="rounded-3xl p-8 text-center"
                            style={{ background: 'rgba(18,18,20,0.95)', border: `1px solid ${current.color}30` }}>

                            {/* Icon */}
                            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl"
                                style={{ background: `${current.color}18`, border: `1px solid ${current.color}30`, boxShadow: `0 8px 32px ${current.color}20` }}>
                                {current.icon}
                            </div>

                            <h2 className="font-display font-black text-white text-2xl leading-tight tracking-tight mb-2">
                                {current.title}
                            </h2>
                            <p className="text-sm font-display font-bold mb-5" style={{ color: current.color }}>
                                {current.subtitle}
                            </p>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                {current.body}
                            </p>

                            {/* Highlight pill */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-bold"
                                style={{ background: `${current.color}12`, border: `1px solid ${current.color}25`, color: current.color }}>
                                {current.highlight}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex gap-3 mt-8 w-full max-w-md">
                    {step > 0 && (
                        <button onClick={() => setStep(s => s - 1)}
                            className="px-5 py-3.5 rounded-2xl font-display font-bold text-sm transition-all active:scale-95"
                            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            ← Back
                        </button>
                    )}

                    {isLast ? (
                        <button onClick={completeTutorial} disabled={completing}
                            className="flex-1 py-3.5 rounded-2xl font-display font-bold text-white transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                            style={{ background: '#E02424', boxShadow: '0 8px 24px rgba(224,36,36,0.4)' }}>
                            {completing
                                ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                : 'Enter Dashboard 🚀'}
                        </button>
                    ) : (
                        <button onClick={() => setStep(s => s + 1)}
                            className="flex-1 py-3.5 rounded-2xl font-display font-bold text-white transition-all active:scale-95"
                            style={{ background: current.color, boxShadow: `0 8px 24px ${current.color}40` }}>
                            Next →
                        </button>
                    )}
                </div>

                {/* Skip option */}
                {!isLast && (
                    <button onClick={() => setStep(STEPS.length - 1)}
                        className="mt-4 text-xs font-display"
                        style={{ color: 'rgba(255,255,255,0.25)' }}>
                        Skip to end
                    </button>
                )}
            </div>
        </>
    )
}
