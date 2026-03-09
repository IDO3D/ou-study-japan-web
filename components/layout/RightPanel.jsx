import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../utils/store'

export default function RightPanel({ currentView }) {
    const { user } = useStore()

    return (
        <aside className="hidden lg:flex flex-col w-80 h-full border-l relative z-10" style={{ background: 'rgba(9,9,11,0.95)', borderColor: 'rgba(255,255,255,0.08)' }}>
            {/* Top Profile Strip */}
            <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-brand bg-black">
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-display font-bold text-white truncate">{user.name}</h3>
                        <p className="text-[10px] text-brand uppercase tracking-widest font-bold">Level 12 Traveler</p>
                    </div>
                </div>
            </div>

            {/* Contextual Context Area depending on view */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence mode="popLayout">
                    {currentView === 'map' ? (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <h4 className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40">Context Panel</h4>
                            <div className="glass p-5 rounded-2xl flex flex-col gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-xl">
                                    📍
                                </div>
                                <h3 className="text-base font-display font-bold text-white leading-tight">Interactive Map Explorer</h3>
                                <p className="text-xs text-white/50 leading-relaxed">
                                    Select any POI from the map to view detailed descriptions, images, reviews, and to start real-time navigation across walking, train, and taxi routes.
                                </p>
                                <button className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold text-white bg-brand hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_16px_rgba(224,36,36,0.3)]">
                                    Enable 3D View
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h4 className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 mb-3">Quick Stats</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl border bg-white/5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                    <p className="text-2xl font-black text-brand mb-1">{user.points.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-white/40 uppercase">Total Points</p>
                                </div>
                                <div className="p-4 rounded-2xl border bg-white/5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                    <p className="text-2xl font-black text-blue-400 mb-1">14</p>
                                    <p className="text-[10px] font-bold text-white/40 uppercase">Days Left</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </aside>
    )
}
