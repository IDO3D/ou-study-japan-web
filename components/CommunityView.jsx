import { useState } from 'react'
import { motion } from 'framer-motion'
import { IcArrow, IcMap } from './ui/Icons'

const COMMUNITY_POSTS = [
    {
        id: 1,
        user: "sarah_j",
        name: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // fushimi inari
        caption: "Early bird gets the torii gate to themselves! ⛩️ Kyoto is literally out of this world.",
        location: "Fushimi Inari Taisha",
        likes: 124,
        comments: 12,
        time: "2h ago",
        badges: ['🎨 Art', '🏛️ OU']
    },
    {
        id: 2,
        user: "chen_david",
        name: "David Chen",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        image: "https://images.unsplash.com/photo-1542051842920-c7aa30458af4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // shibuya
        caption: "Friday night in Shibuya. The energy here is unmatched! ⚡️",
        location: "Shibuya Crossing",
        likes: 342,
        comments: 45,
        time: "5h ago",
        badges: ['💻 Tech']
    },
    {
        id: 3,
        user: "elena.rod",
        name: "Elena Rodriguez",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        image: "https://images.unsplash.com/photo-1590324089856-1eb4b049d590?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // dotonbori
        caption: "I could eat Takoyaki forever. Osaka food tour day 1 complete! 🐙",
        location: "Dotonbori, Osaka",
        likes: 89,
        comments: 5,
        time: "1d ago",
        badges: ['🏛️ OU', '📸 Photo']
    }
]

export default function CommunityView() {
    const [activeTab, setActiveTab] = useState('Following')

    return (
        <div className="pb-24 pt-4">
            {/* Header */}
            <div className="flex items-center justify-between px-5 mb-4 sticky top-0 bg-black/80 backdrop-blur-xl z-20 py-2">
                <h1 className="font-display font-black text-white text-2xl tracking-tighter">Community</h1>
                <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 px-5 mb-4 border-b border-white/10">
                {['Following', 'Discover', 'OU Only'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === tab ? 'text-white' : 'text-white/40'}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="communityTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E02424]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {COMMUNITY_POSTS.map((post) => (
                    <div key={post.id} className="bg-[#0A0A0C] border-y sm:border border-white/5 sm:rounded-2xl sm:mx-4 overflow-hidden">
                        {/* Post Header */}
                        <div className="flex items-center justify-between p-3.5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E02424]/40 p-[2px]">
                                    <img src={post.avatar} alt={post.user} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-display font-bold text-sm text-white tracking-wide">{post.user}</span>
                                        {post.badges.map(b => (
                                            <span key={b} className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded-sm text-white/80">{b}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <IcMap size={10} color="#818CF8" />
                                        <span className="text-[10px] text-white/50">{post.location}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-white/40 hover:text-white pb-2 px-1">•••</button>
                        </div>

                        {/* Image */}
                        <div className="relative aspect-[4/5] w-full bg-black/50">
                            <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                        </div>

                        {/* Actions */}
                        <div className="p-3.5 pb-2">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex gap-4">
                                    <button className="hover:scale-110 active:scale-95 transition-transform"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
                                    <button className="hover:scale-110 active:scale-95 transition-transform"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></button>
                                    <button className="hover:scale-110 active:scale-95 transition-transform"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
                                </div>
                                <button className="hover:scale-110 active:scale-95 transition-transform"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg></button>
                            </div>
                            <p className="font-bold text-sm text-white mb-1.5">{post.likes.toLocaleString()} likes</p>
                            <p className="text-sm text-white/90 font-medium leading-snug">
                                <span className="font-bold mr-2">{post.user}</span>
                                {post.caption}
                            </p>
                            <button className="text-[12px] text-white/40 mt-1.5 font-medium">View all {post.comments} comments</button>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1.5 font-mono">{post.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
