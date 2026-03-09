// components/layout/TabletRail.jsx — Left icon rail for tablet (768–1023px)
import { motion } from 'framer-motion'
import { IcHome, IcCamera, IcMap, IcStar, IcBook, IcHotel, IcUser } from '../ui/Icons'
import OULogo from '../ui/OULogo'
import ThemeSwitcher from '../ui/ThemeSwitcher'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

const NAV = [
    { view: 'home', Icon: IcHome, label: 'Home' },
    { view: 'discover', Icon: IcCamera, label: 'Discover' },
    { view: 'camera', Icon: IcCamera, label: 'Translate' },
    { view: 'map', Icon: IcMap, label: 'Map' },
    { view: 'quests', Icon: IcStar, label: 'Quests' },
    { view: 'canvas', Icon: IcBook, label: 'Canvas' },
    { view: 'housing', Icon: IcHotel, label: 'Stay' },
    { view: 'profile', Icon: IcUser, label: 'Profile' },
]

export default function TabletRail({ currentView, onNavigate }) {
    const [showTheme, setShowTheme] = useState(false)

    return (
        <div
            style={{
                width: 72,
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingBlock: 20,
                gap: 4,
                background: 'var(--nav-bg)',
                borderRight: '1px solid var(--border)',
                flexShrink: 0,
                position: 'relative',
            }}
        >
            {/* OU Logo */}
            <div style={{ marginBottom: 16 }}>
                <OULogo size={36} variant="mark" />
            </div>

            {/* Nav items */}
            {NAV.map(({ view, Icon, label }) => {
                const active = currentView === view
                return (
                    <button
                        key={view}
                        onClick={() => onNavigate(view)}
                        title={label}
                        style={{
                            width: 52, height: 52,
                            borderRadius: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 3,
                            cursor: 'pointer',
                            border: 'none',
                            background: active ? 'var(--brand-subtle)' : 'transparent',
                            outline: active ? '1px solid var(--brand)' : 'none',
                            transition: 'all 0.15s',
                        }}
                    >
                        <Icon size={20} color={active ? 'var(--brand)' : 'rgba(255,255,255,0.35)'} strokeWidth={active ? 2.2 : 1.6} />
                        <span style={{ fontSize: 8, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: active ? 'var(--brand-light)' : 'rgba(255,255,255,0.25)', letterSpacing: '0.03em' }}>
                            {label}
                        </span>
                    </button>
                )
            })}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Theme toggle */}
            <button
                onClick={() => setShowTheme(s => !s)}
                title="Theme"
                style={{
                    width: 52, height: 52, borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: 'none',
                    background: showTheme ? 'var(--brand-subtle)' : 'transparent',
                }}
            >
                <span style={{ fontSize: 20 }}>🎨</span>
            </button>

            {/* Theme picker popup */}
            <AnimatePresence>
                {showTheme && (
                    <div style={{ position: 'absolute', bottom: 80, left: 80, zIndex: 200 }}>
                        <ThemeSwitcher onClose={() => setShowTheme(false)} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
