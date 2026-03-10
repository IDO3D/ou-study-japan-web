import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { IcHome, IcMap, IcFood, IcHotel } from './ui/Icons'
import OULogo from './ui/OULogo'

const cycleIcons = [
    { id: 'house', Icon: IcHotel },
    { id: 'train', Icon: () => <span>🚆</span> }, // Simple train emoji fallback or import custom
    { id: 'food', Icon: IcFood },
    { id: 'map', Icon: IcMap }
]

export default function LoadingScreen({ onComplete }) {
    const [iconIndex, setIconIndex] = useState(0)

    useEffect(() => {
        // Fast cycle through icons
        const interval = setInterval(() => {
            setIconIndex((prev) => (prev + 1) % cycleIcons.length)
        }, 400) // Change icon every 400ms

        // Force load completion after 2 seconds
        const timeout = setTimeout(() => {
            onComplete?.()
        }, 2000)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [onComplete])

    const CurrentIcon = cycleIcons[iconIndex].Icon

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
        >
            <div className="flex flex-col items-center justify-center gap-6 relative">
                {/* Glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#E02424]/30 rounded-full blur-[40px] mix-blend-screen animate-pulse pointer-events-none" />

                {/* Dynamic Center Icon Loop */}
                <motion.div
                    key={cycleIcons[iconIndex].id}
                    initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 1.5, opacity: 0, rotate: 15 }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-white/10 relative z-10"
                    style={{ background: 'linear-gradient(135deg, rgba(224,36,36,0.2) 0%, rgba(0,0,0,0.8) 100%)' }}
                >
                    {typeof CurrentIcon === 'function' ? (
                        <CurrentIcon size={32} color="white" />
                    ) : (
                        React.cloneElement(CurrentIcon, { size: 32, color: 'white' }) // fallback
                    )}
                </motion.div>

                {/* Loading Bar */}
                <div className="flex flex-col items-center gap-3 z-10">
                    <div className="flex items-center gap-2">
                        <OULogo size={16} variant="mark" />
                        <span className="font-display font-bold text-white tracking-widest uppercase text-[10px]">
                            Syncing Japan
                        </span>
                    </div>

                    <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#E02424] to-[#FF8E53] rounded-full"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
