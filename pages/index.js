// pages/index.js — v5 Production app entry
import { useState, useEffect } from 'react'
import Head from 'next/head'
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

export default function App() {
  const [view, setView] = useState('home')
  const { setRestaurants, setQuests, setExchangeRate, setUserLocation } = useStore()

  // Expose navigate globally for cross-component navigation
  useEffect(() => {
    if (typeof window !== 'undefined') window.__ouNav = setView
  }, [setView])

  useEffect(() => {
    // Geolocation
    getCurrentPosition().then(setUserLocation).catch(() => {})

    // Data fetching with silent failure (mock fallbacks in each API route)
    fetch('/api/restaurants')
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.restaurants && setRestaurants(d.restaurants))
      .catch(() => {})

    fetch('/api/quests')
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.quests && setQuests(d.quests))
      .catch(() => {})

    fetch('/api/exchange-rate')
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.rate && setExchangeRate(d.rate))
      .catch(() => {})
  }, [])

  const VIEWS = {
    home:     <HomeView onNavigate={setView} />,
    discover: <DiscoverView />,
    camera:   <CameraView />,
    map:      <MapView />,
    quests:   <QuestsView />,
    profile:  <ProfileView />,
    canvas:   <CanvasView />,
    housing:  <HousingView />,
  }

  return (
    <>
      <Head>
        <title>OUStudyJapan</title>
        <meta name="description" content="OU Study Abroad travel assistant — Japan 2025" />
        {/* Mobile viewport — prevents zoom on input focus */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        {/* PWA */}
        <meta name="theme-color" content="#09090b" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="OUJapan" />
        {/* OG */}
        <meta property="og:title" content="OUStudyJapan" />
        <meta property="og:description" content="Your OU study abroad companion for Japan" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://oujapanapp.us" />
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <div style={{
        minHeight: '100svh',
        background: '#09090b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AppShell currentView={view} onNavigate={setView}>
          {VIEWS[view] || VIEWS.home}
        </AppShell>
      </div>
    </>
  )
}
