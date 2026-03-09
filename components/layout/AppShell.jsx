// components/layout/AppShell.jsx
import Navigation from './Navigation'
import Header from './Header'

export default function AppShell({ children, currentView, onNavigate }) {
  return (
    <div
      id="app-shell"
      className="relative flex flex-col"
      style={{
        width: '100%',
        maxWidth: '430px',
        height: '100dvh',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 15% 8%, rgba(224,36,36,0.07) 0%, transparent 55%), #09090b',
      }}
    >
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
    </div>
  )
}
