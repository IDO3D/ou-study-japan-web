// pages/dashboard.js — Main application (protected, tutorial-completed users only)
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AppShell from '../components/layout/AppShell'
import HomeView from '../components/HomeView'
import DiscoverView from '../components/DiscoverView'
import CameraView from '../components/CameraView'
import MapView from '../components/MapView'
import QuestsView from '../components/QuestsView'
import ProfileView from '../components/ProfileView'
import CanvasView from '../components/CanvasView'
import HousingView from '../components/HousingView'
import useStore from '../utils/store'
import { getCurrentPosition } from '../utils/helpers'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

export default function Dashboard() {
    const router = useRouter()
    const [view, setView] = useState('home')
    const [authReady, setAuthReady] = useState(false)
    const { setRestaurants, setQuests, setExchangeRate, setUserLocation, setUser, setNavDestination } = useStore()

    // Auth guard + load user profile
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { router.push('/login'); return }

            // Try to load profile from DB, fall back to auth metadata
            let name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Traveler'
            let university = 'University of Oklahoma'
            let major = ''
            let year = ''
            let points = 0
            let dailyBudgetJpy = 4500
            let avatarUrl = ''

            try {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (profile) {
                    name = profile.name || name
                    university = profile.university || university
                    major = profile.major || major
                    year = profile.year || year
                    points = profile.points || points
                    dailyBudgetJpy = profile.daily_budget_jpy || dailyBudgetJpy
                    avatarUrl = profile.avatar_url || ''
                }
            } catch (_) {
                // profiles table not set up yet — use auth metadata
            }

            setUser({
                id: session.user.id,
                name,
                email: session.user.email,
                avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E02424&color=fff&bold=true`,
                points,
                dailyBudgetJpy,
                university,
                major,
                year,
            })

            setAuthReady(true)
        }
        init()

        // Listen for auth changes (logout etc)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') router.push('/')
        })

        return () => subscription.unsubscribe()
    }, [])

    // Load app data
    useEffect(() => {
        if (!authReady) return

        getCurrentPosition().then(setUserLocation).catch(() => { })

        fetch('/api/restaurants')
            .then(r => r.json())
            .then(d => setRestaurants(d.restaurants || []))
            .catch(() => { })

        fetch('/api/quests')
            .then(r => r.json())
            .then(d => setQuests(d.quests || []))
            .catch(() => { })

        fetch('/api/exchange-rate')
            .then(r => r.json())
            .then(d => { if (d.rate) setExchangeRate(d.rate) })
            .catch(() => { })
    }, [authReady])

    // Expose navigate globally
    useEffect(() => {
        if (typeof window !== 'undefined') window.__ouNav = setView
    }, [setView])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        toast.success('Signed out. Safe travels! 🎌')
        router.push('/')
    }

    // Helper: set destination in store, then switch to map tab
    const navigateInApp = (dest) => {
        setNavDestination(dest)
        setView('map')
    }

    const VIEWS = {
        home: <HomeView onNavigate={setView} />,
        discover: <DiscoverView onNavigateToMap={navigateInApp} />,
        camera: <CameraView />,
        map: <MapView />,
        quests: <QuestsView />,
        profile: <ProfileView onSignOut={handleSignOut} />,
        canvas: <CanvasView />,
        housing: <HousingView onNavigateToMap={navigateInApp} />,
    }

    if (!authReady) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: 'var(--bg)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#841617', boxShadow: '0 0 32px rgba(132,22,23,0.5)' }}>
                    <span className="font-display font-black text-white text-2xl" style={{ fontFamily: 'Georgia, serif' }}>OU</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full animate-pulse" style={{ width: '60%', background: '#841617' }} />
                    </div>
                    <p className="text-xs font-display font-bold" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                        LOADING
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Dashboard — OU Study Japan</title>
                <meta name="description" content="OU Study Abroad travel assistant for Japan" />
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="theme-color" content="#09090b" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            </Head>

            <div style={{ minHeight: '100svh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AppShell currentView={view} onNavigate={setView}>
                    {VIEWS[view] || VIEWS.home}
                </AppShell>
            </div>
        </>
    )
}
