// pages/_app.js
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import useStore from '../utils/store'

export default function App({ Component, pageProps }) {
  const { setTheme } = useStore()

  // Restore saved theme on first load
  useEffect(() => {
    const saved = localStorage.getItem('ou_theme') || 'dark'
    setTheme(saved)
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-center"
        containerStyle={{ top: 80 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--surface2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            maxWidth: '320px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
        }}
      />
    </>
  )
}
