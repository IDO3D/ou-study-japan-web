// components/layout/AppShell.jsx — True responsive: phone / tablet / desktop layouts
import { useState, useEffect } from 'react'
import Navigation from './Navigation'
import DesktopSidebar from './DesktopSidebar'
import TabletRail from './TabletRail'
import Header from './Header'

function useBreakpoint() {
  const [bp, setBp] = useState('phone')
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      if (w >= 1024) setBp('desktop')
      else if (w >= 768) setBp('tablet')
      else setBp('phone')
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return bp
}

/* ─── Phone Layout (< 768px) ─────────────────────────────── */
function PhoneShell({ children, currentView, onNavigate }) {
  return (
    <div
      id="app-shell"
      style={{
        width: '100%',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      {/* Map view is a full-screen overlay — skip header/nav padding */}
      {currentView === 'map' ? (
        <>
          {children}
          <Navigation currentView={currentView} onNavigate={onNavigate} />
        </>
      ) : (
        <>
          <Header currentView={currentView} onNavigate={onNavigate} />
          <main
            className="flex-1 overflow-y-auto hide-scroll"
            style={{
              paddingTop: 'max(88px, calc(env(safe-area-inset-top) + 76px))',
              paddingBottom: 'max(88px, calc(env(safe-area-inset-bottom) + 76px))',
            }}
          >
            {children}
          </main>
          <Navigation currentView={currentView} onNavigate={onNavigate} />
        </>
      )}
    </div>
  )
}

/* ─── Tablet Layout (768–1023px) ─────────────────────────── */
function TabletShell({ children, currentView, onNavigate }) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Left rail nav */}
      <TabletRail currentView={currentView} onNavigate={onNavigate} />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tablet header */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingInline: 28,
            borderBottom: '1px solid var(--border)',
            background: 'var(--header-bg)',
            backdropFilter: 'blur(20px)',
            flexShrink: 0,
          }}
        >
          <TabletHeaderLeft currentView={currentView} />
          <TabletHeaderRight onNavigate={onNavigate} />
        </div>

        {/* Scrollable content */}
        <main
          className="flex-1 overflow-y-auto hide-scroll"
          style={{ padding: '24px 28px', maxWidth: 900, width: '100%', margin: '0 auto' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

/* ─── Desktop Layout (1024px+) ───────────────────────────── */
function DesktopShell({ children, currentView, onNavigate }) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Full sidebar */}
      <DesktopSidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Right: header + content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Desktop top bar */}
        <div
          style={{
            height: 68,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingInline: 36,
            borderBottom: '1px solid var(--border)',
            background: 'var(--header-bg)',
            backdropFilter: 'blur(20px)',
            flexShrink: 0,
          }}
        >
          <TabletHeaderLeft currentView={currentView} />
          <TabletHeaderRight onNavigate={onNavigate} />
        </div>

        {/* Content grid */}
        <main
          className="flex-1 overflow-y-auto hide-scroll"
          style={{ padding: '32px 36px', maxWidth: 1200, width: '100%', alignSelf: 'center' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

/* ─── Shared sub-components ──────────────────────────────── */
function TabletHeaderLeft({ currentView }) {
  const VIEW_META = {
    home: 'Home', discover: 'Discover', camera: 'Translate',
    map: 'Map & Navigation', quests: 'Quests', canvas: 'OU Canvas',
    housing: 'Your Stay', profile: 'Profile',
  }
  return (
    <div>
      <h1 className="font-display font-black text-white" style={{ fontSize: '1.35rem', letterSpacing: '-0.025em' }}>
        {VIEW_META[currentView] || 'Home'}
      </h1>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
        OU Study Japan · Japan Program 2026
      </p>
    </div>
  )
}

function TabletHeaderRight({ onNavigate }) {
  const { user } = require('../../utils/store').default.getState()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
        {user?.email || ''}
      </div>
      <button
        onClick={() => onNavigate('profile')}
        style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--brand), #FF8E53)',
          border: 'none', cursor: 'pointer', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {user?.avatarUrl
          ? <img src={user.avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ color: 'white', fontWeight: 800, fontSize: 16, fontFamily: 'Syne, sans-serif' }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </span>
        }
      </button>
    </div>
  )
}

/* ─── Root AppShell — picks layout by screen size ─────────── */
export default function AppShell({ children, currentView, onNavigate }) {
  const bp = useBreakpoint()

  if (bp === 'desktop') return <DesktopShell currentView={currentView} onNavigate={onNavigate}>{children}</DesktopShell>
  if (bp === 'tablet') return <TabletShell currentView={currentView} onNavigate={onNavigate}>{children}</TabletShell>
  return <PhoneShell currentView={currentView} onNavigate={onNavigate}>{children}</PhoneShell>
}
