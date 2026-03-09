// components/layout/DesktopSidebar.jsx — Full sidebar for desktop (1024px+)
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { IcHome, IcCamera, IcMap, IcStar, IcBook, IcHotel, IcUser } from '../ui/Icons'
import OULogo from '../ui/OULogo'
import ThemeSwitcher from '../ui/ThemeSwitcher'
import useStore from '../../utils/store'

const NAV_GROUPS = [
    {
        label: 'Main',
        items: [
            { view: 'home', Icon: IcHome, label: 'Home', desc: 'Dashboard overview' },
            { view: 'discover', Icon: IcStar, label: 'Discover', desc: 'Food & dining' },
            { view: 'map', Icon: IcMap, label: 'Map', desc: 'Navigation & places' },
            { view: 'quests', Icon: IcStar, label: 'Quests', desc: 'Activities & points' },
        ]
    },
    {
        label: 'Tools',
        items: [
            { view: 'camera', Icon: IcCamera, label: 'Translate', desc: 'AI Japanese translator' },
            { view: 'canvas', Icon: IcBook, label: 'OU Canvas', desc: 'Courses & academics' },
            { view: 'housing', Icon: IcHotel, label: 'Stay', desc: 'Housing & cities' },
            { view: 'profile', Icon: IcUser, label: 'Profile', desc: 'Account & settings' },
        ]
    },
]

export default function DesktopSidebar({ currentView, onNavigate }) {
    const { user, theme } = useStore()
    const [showTheme, setShowTheme] = useState(false)

    return (
        <div
            style={{
                width: 240,
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--nav-bg)',
                borderRight: '1px solid var(--border)',
                flexShrink: 0,
                padding: '24px 0',
                position: 'relative',
            }}
        >
            {/* Brand */}
            <div style={{ paddingInline: 20, marginBottom: 28 }}>
                <OULogo size={36} variant="full" />
                <div style={{
                    marginTop: 12, paddingTop: 12,
                    borderTop: '1px solid var(--border)',
                    fontSize: 10, color: 'var(--text-muted)',
                    fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                }}>
                    Japan Study Abroad 2026
                </div>
            </div>

            {/* Nav groups */}
            <div style={{ flex: 1, overflowY: 'auto', paddingInline: 12 }}>
                {NAV_GROUPS.map(group => (
                    <div key={group.label} style={{ marginBottom: 24 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6, paddingInline: 8, fontFamily: 'Syne, sans-serif' }}>
                            {group.label}
                        </p>
                        {group.items.map(({ view, Icon, label, desc }) => {
                            const active = currentView === view
                            return (
                                <button
                                    key={view}
                                    onClick={() => onNavigate(view)}
                                    style={{
                                        width: '100%', padding: '10px 12px',
                                        borderRadius: 12, marginBottom: 2,
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        cursor: 'pointer', border: 'none',
                                        background: active ? 'var(--brand-subtle)' : 'transparent',
                                        outline: active ? '1px solid var(--brand)' : 'none',
                                        transition: 'all 0.15s',
                                        textAlign: 'left',
                                    }}
                                >
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 10,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: active ? 'var(--brand)' : 'rgba(255,255,255,0.07)',
                                        flexShrink: 0,
                                    }}>
                                        <Icon size={16} color={active ? 'white' : 'rgba(255,255,255,0.5)'} strokeWidth={active ? 2.2 : 1.6} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: active ? 'white' : 'rgba(255,255,255,0.7)', fontFamily: 'Syne, sans-serif', lineHeight: 1.2 }}>
                                            {label}
                                        </p>
                                        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
                                            {desc}
                                        </p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>

            {/* Bottom — user card + theme */}
            <div style={{ paddingInline: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                {/* Theme */}
                <button
                    onClick={() => setShowTheme(s => !s)}
                    style={{
                        width: '100%', padding: '9px 12px', borderRadius: 12, marginBottom: 8,
                        display: 'flex', alignItems: 'center', gap: 10,
                        cursor: 'pointer', border: '1px solid var(--border)',
                        background: showTheme ? 'var(--brand-subtle)' : 'rgba(255,255,255,0.04)',
                    }}
                >
                    <span style={{ fontSize: 16 }}>🎨</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif' }}>
                        Appearance
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}>
                        {theme}
                    </span>
                </button>

                {/* User card */}
                <button
                    onClick={() => onNavigate('profile')}
                    style={{
                        width: '100%', padding: '10px 12px', borderRadius: 12,
                        display: 'flex', alignItems: 'center', gap: 10,
                        cursor: 'pointer', border: '1px solid var(--border)',
                        background: 'rgba(255,255,255,0.04)',
                    }}
                >
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" style={{ width: 32, height: 32, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14, flexShrink: 0, fontFamily: 'Syne, sans-serif' }}>
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: 'white', fontFamily: 'Syne, sans-serif', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.name || 'Student'}
                        </p>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.university || 'University of Oklahoma'}
                        </p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>→</span>
                </button>
            </div>

            {/* Theme picker */}
            <AnimatePresence>
                {showTheme && (
                    <div style={{ position: 'absolute', bottom: 130, left: 248, zIndex: 200, width: 280 }}>
                        <ThemeSwitcher onClose={() => setShowTheme(false)} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
