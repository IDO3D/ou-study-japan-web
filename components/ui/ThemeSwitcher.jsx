// components/ui/ThemeSwitcher.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import useStore from '../../utils/store'

const THEMES = [
    { id: 'dark', label: 'Dark', icon: '🌑', desc: 'Default dark mode' },
    { id: 'light', label: 'Light', icon: '☀️', desc: 'Clean Washi Paper' },
    { id: 'japan', label: 'Japan', icon: '🌸', desc: 'Sakura pink & indigo' },
    { id: 'ou', label: 'OU', icon: '⭕', desc: 'OU Crimson official' },
    { id: 'business', label: 'Business', icon: '💼', desc: 'Slate blue' },
]

export default function ThemeSwitcher({ onClose }) {
    const { theme, setTheme } = useStore()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-28 left-4 right-4 z-50 rounded-3xl p-4 shadow-2xl"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', backdropFilter: 'blur(30px)' }}
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="font-display font-black text-white text-sm">Appearance</p>
                    <p className="text-[10px] font-display font-bold" style={{ color: 'var(--text-muted)' }}>Choose your theme</p>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-xs active:scale-90 transition-transform"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {THEMES.map(t => (
                    <button
                        key={t.id}
                        onClick={() => { setTheme(t.id); onClose?.() }}
                        className="p-3 rounded-2xl flex items-center gap-2.5 transition-all active:scale-95 text-left"
                        style={{
                            background: theme === t.id ? 'var(--brand-subtle)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${theme === t.id ? 'var(--brand)' : 'var(--border)'}`,
                        }}
                    >
                        <span className="text-xl flex-shrink-0">{t.icon}</span>
                        <div>
                            <p className="font-display font-bold text-white text-xs">{t.label}</p>
                            <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                        </div>
                        {theme === t.id && (
                            <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white flex-shrink-0"
                                style={{ background: 'var(--brand)' }}>✓</div>
                        )}
                    </button>
                ))}
            </div>
        </motion.div>
    )
}
