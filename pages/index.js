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

export default function Home() {
  const [currentView, setCurrentView] = useState('home')
  const { setRestaurants, setQuests, setExchangeRate, setUserLocation } = useStore()

  useEffect(() => {
    getCurrentPosition().then(setUserLocation)

    fetch('/api/restaurants')
      .then(r => r.json())
      .then(d => setRestaurants(d.restaurants || []))
      .catch(console.error)

    fetch('/api/quests')
      .then(r => r.json())
      .then(d => setQuests(d.quests || []))
      .catch(console.error)

    fetch('/api/exchange-rate')
      .then(r => r.json())
      .then(d => { if (d.rate) setExchangeRate(d.rate) })
      .catch(console.error)
  }, [])

  const navigate = (view) => {
    setCurrentView(view)
    if (typeof window !== 'undefined') window.__ouNavigate = (v) => setCurrentView(v)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') window.__ouNavigate = (v) => setCurrentView(v)
  }, [])

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView onNavigate={navigate} />
      case 'discover': return <DiscoverView />
      case 'camera': return <CameraView />
      case 'map': return <MapView />
      case 'quests': return <QuestsView />
      case 'profile': return <ProfileView />
      case 'canvas': return <CanvasView />
      case 'housing': return <HousingView />
      default: return <HomeView onNavigate={navigate} />
    }
  }

  return (
    <>
      <Head>
        <title>OUStudyJapan</title>
        <meta name="description" content="Your OU study abroad travel assistant for Japan" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AppShell currentView={currentView} onNavigate={navigate}>
          {renderView()}
        </AppShell>
      </div>
    </>
  )
}
