import { motion } from 'framer-motion'

const NAV_ITEMS = [
    { view: 'home', label: 'Home', icon: '⌂' },
    { view: 'map', label: 'Map Explorer', icon: '◈' },
    { view: 'discover', label: 'Discovery', icon: '✦' },
    { view: 'housing', label: 'Housing', icon: '⬡' },
    { view: 'quests', label: 'Rewards', icon: '★' },
    { view: 'profile', label: 'Profile', icon: '◯' },
    { view: 'canvas', label: 'Settings', icon: '⚙' },
]

export default function Sidebar({ currentView, onNavigate }) {
    return (
        <aside className="hidden md:flex flex-col w-64 h-full border-r relative z-10" style={{ background: 'rgba(9,9,11,0.95)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="p-6">
                <h1 className="font-display font-black text-white text-xl tracking-tight">
                    OUStudyJapan
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-brand mt-1 font-bold">
                    Navigation
                </p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {NAV_ITEMS.map(item => {
                    const isActive = currentView === item.view
                    return (
                        <button
                            key={item.view}
                            onClick={() => onNavigate(item.view)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-brand/10 border-brand/20 text-brand' : 'text-white/50 hover:bg-white/5 hover:text-white'
                                }`}
                            style={{ border: isActive ? '1px solid rgba(224,36,36,0.2)' : '1px solid transparent' }}
                        >
                            <span className="text-xl font-serif">{item.icon}</span>
                            <span className="font-display font-semibold text-sm">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            <div className="p-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <button className="w-full py-3 rounded-xl text-xs font-display font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
