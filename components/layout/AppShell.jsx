// components/layout/AppShell.jsx — v5 Theme-aware shell
import Navigation from './Navigation'
import Header from './Header'
import useStore from '../../utils/store'
import { getTheme } from '../../utils/themes'

export default function AppShell({ children, currentView, onNavigate }) {
  const { theme } = useStore()
  const t = getTheme(theme)

  return (
    <div
      id="app-shell"
      className="relative flex flex-col"
      style={{
        width: '100%',
        maxWidth: '430px',
        height: '100dvh',
        overflow: 'hidden',
        background: t.bgGradient,
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
