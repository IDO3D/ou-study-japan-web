// pages/index.js
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

  // Expose navigate globally for avatar tap
  useEffect(() => {
    if (typeof window !== 'undefined') window.__ouNav = setView
  }, [setView])

  useEffect(() => {
    getCurrentPosition().then(setUserLocation).catch(() => {})

    fetch('/api/restaurants')
      .then(r => r.json())
      .then(d => setRestaurants(d.restaurants || []))
      .catch(() => {})

    fetch('/api/quests')
      .then(r => r.json())
      .then(d => setQuests(d.quests || []))
      .catch(() => {})

    fetch('/api/exchange-rate')
      .then(r => r.json())
      .then(d => { if (d.rate) setExchangeRate(d.rate) })
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
        <meta name="description" content="OU Study Abroad travel assistant for Japan" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#09090b" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="OUJapan" />
        <meta property="og:title" content="OUStudyJapan" />
        <meta property="og:description" content="Your OU study abroad companion for Japan" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ minHeight: '100svh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AppShell currentView={view} onNavigate={setView}>
          {VIEWS[view] || VIEWS.home}
        </AppShell>
      </div>
    </>
  )
}
