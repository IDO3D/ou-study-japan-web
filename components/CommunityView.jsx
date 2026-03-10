import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IcMap, IcCamera } from './ui/Icons'
import toast from 'react-hot-toast'

const INITIAL_POSTS = [
    {
        id: 1,
        user: "sarah_j",
        name: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        caption: "Early bird gets the torii gate to themselves! ⛩️ Kyoto is literally out of this world.",
        location: "Fushimi Inari Taisha",
        likes: 124,
        comments: 12,
        time: "2h ago",
        badges: ['🎨 Art', '🏛️ OU'],
        isLiked: true,
        isSaved: false
    },
    {
        id: 2,
        user: "chen_david",
        name: "David Chen",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        image: "https://images.unsplash.com/photo-1542051842920-c7aa30458af4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        caption: "Friday night in Shibuya. The energy here is unmatched! ⚡️",
        location: "Shibuya Crossing",
        likes: 342,
        comments: 45,
        time: "5h ago",
        badges: ['💻 Tech'],
        isLiked: false,
        isSaved: true
    },
    {
        id: 3,
        user: "elena.rod",
        name: "Elena Rodriguez",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        image: "https://images.unsplash.com/photo-1590324089856-1eb4b049d590?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        caption: "I could eat Takoyaki forever. Osaka food tour day 1 complete! 🐙",
        location: "Dotonbori, Osaka",
        likes: 89,
        comments: 5,
        time: "1d ago",
        badges: ['🏛️ OU', '📸 Photo'],
        isLiked: false,
        isSaved: false
    }
]

const STORIES = [
    { id: 'prof_s', name: 'Dr. Smith', type: 'Update', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', active: true },
    { id: 'evt_sakura', name: 'Sakura Fest.', type: 'Event', avatar: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=200&q=80', active: true },
    { id: 'prof_t', name: 'Tanaka Sensei', type: 'Class', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', active: true },
    { id: 'evt_k', name: 'Karaoke', type: 'Event', avatar: 'https://images.unsplash.com/photo-1516280440502-863a165b6ff4?w=200&q=80', active: false },
    { id: 'evt_trip', name: 'Tokyo Trip', type: 'Event', avatar: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=200&q=80', active: false },
]

export default function CommunityView() {
    const [activeTab, setActiveTab] = useState('Following')
    const [posts, setPosts] = useState(INITIAL_POSTS)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [newPostCaption, setNewPostCaption] = useState('')

    const handleLike = (id) => {
        setPosts(posts.map(p => {
            if (p.id === id) {
                return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
            }
            return p
        }))
    }

    const handleSave = (id) => {
        toast(posts.find(p => p.id === id)?.isSaved ? "Removed from saved" : "Saved to collection!", { icon: "🔖" })
        setPosts(posts.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    }

    const handleShare = () => {
        toast.success("Post link copied to clipboard!")
    }

    const handleComment = () => {
        toast("Opening comment thread...", { icon: "💬" })
    }

    const handleCreatePost = () => {
        if (!newPostCaption.trim()) {
            toast.error("Please enter a caption!")
            return
        }

        const newPost = {
            id: Date.now(),
            user: "you_student", // mock user
            name: "You",
            avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80",
            image: "https://images.unsplash.com/photo-1528148343865-51218c4a13e6?w=800&q=80", // generic cool japan photo
            caption: newPostCaption,
            location: "Tokyo, Japan",
            likes: 0,
            comments: 0,
            time: "Just now",
            badges: ['🏛️ OU Newbie'],
            isLiked: false,
            isSaved: false
        }

        setPosts([newPost, ...posts])
        setNewPostCaption('')
        setShowUploadModal(false)
        toast.success("Successfully posted to feed!")
    }

    return (
        <div className="pb-24 pt-4 bg-black min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between px-5 mb-2 sticky top-0 bg-black/80 backdrop-blur-xl z-20 py-3 border-b border-white/10">
                <h1 className="font-display font-black text-white text-2xl tracking-tighter shadow-sm">Community</h1>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowUploadModal(true)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors active:scale-95">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <button onClick={() => toast("Opening messages from professors...", { icon: "📨" })} className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors active:scale-95">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black"></span>
                    </button>
                </div>
            </div>

            {/* Stories Section (Professors & Events) */}
            <div className="px-4 py-3 border-b border-white/10 overflow-x-auto hide-scroll flex gap-4">
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0 relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                            <span className="text-xl">+</span>
                        </div>
                    </div>
                    <span className="text-[10px] text-white/50 font-bold">Your Story</span>
                </div>

                {STORIES.map(story => (
                    <button key={story.id} onClick={() => toast(`Viewing ${story.type.toLowerCase()} from ${story.name}`, { icon: "🎥" })} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
                        <div className={`w-16 h-16 rounded-full p-[2px] ${story.active ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' : 'bg-white/20'}`}>
                            <div className="w-full h-full bg-black rounded-full p-[2px]">
                                <img src={story.avatar} alt={story.name} className="w-full h-full object-cover rounded-full" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <span className="text-[10px] text-white font-bold leading-tight truncate w-16">{story.name}</span>
                            <span className={`text-[8px] font-mono tracking-widest ${story.active ? 'text-[#E02424]' : 'text-white/40'}`}>{story.type}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-6 px-5 mt-2 mb-2">
                {['Following', 'Discover', 'OU Only'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 pt-2 text-sm font-bold tracking-wide transition-colors relative flex-1 ${activeTab === tab ? 'text-white' : 'text-white/40'}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="communityTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Feed */}
            <div className="space-y-6 bg-black">
                {posts.map((post) => (
                    <div key={post.id} className="bg-black border-y sm:border border-white/10 sm:rounded-2xl sm:mx-4 overflow-hidden">
                        {/* Post Header */}
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full p-[1px] bg-gradient-to-tr from-yellow-400 to-red-500`}>
                                    <div className="w-full h-full bg-black rounded-full p-[1px]">
                                        <img src={post.avatar} alt={post.user} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-display font-bold text-sm text-white tracking-wide">{post.user}</span>
                                        {post.badges.map(b => (
                                            <span key={b} className="text-[9px] font-bold bg-white/10 px-1.5 py-0.5 rounded-sm text-white/80">{b}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-white/50 font-medium">{post.location}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-white/60 hover:text-white px-2">•••</button>
                        </div>

                        {/* Image */}
                        <div className="relative aspect-[4/5] w-full bg-black/50" onDoubleClick={() => !post.isLiked && handleLike(post.id)}>
                            <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                        </div>

                        {/* Actions */}
                        <div className="py-3 px-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex gap-4">
                                    {/* Like Button */}
                                    <button onClick={() => handleLike(post.id)} className="hover:scale-110 active:scale-95 transition-transform flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill={post.isLiked ? "#E02424" : "none"} stroke={post.isLiked ? "#E02424" : "white"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    </button>
                                    {/* Comment Button */}
                                    <button onClick={handleComment} className="hover:scale-110 active:scale-95 transition-transform flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                    </button>
                                    {/* Share Button (airplane) */}
                                    <button onClick={handleShare} className="hover:scale-110 active:scale-95 transition-transform flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </button>
                                </div>
                                {/* Save/Bookmark Button */}
                                <button onClick={() => handleSave(post.id)} className="hover:scale-110 active:scale-95 transition-transform flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill={post.isSaved ? "white" : "none"} stroke="white" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                                </button>
                            </div>
                            <p className="font-bold text-sm text-white mb-1.5">{post.likes.toLocaleString()} likes</p>
                            <p className="text-sm text-white/90 font-medium leading-snug">
                                <span className="font-bold mr-2">{post.user}</span>
                                {post.caption}
                            </p>
                            <button onClick={handleComment} className="text-[13px] text-white/50 mt-1.5 font-medium">View all {post.comments} comments</button>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1.5 font-mono">{post.time}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[100] bg-black text-white flex flex-col"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 pt-[env(safe-area-inset-top,20px)] mt-4">
                            <button onClick={() => setShowUploadModal(false)} className="text-white/80 font-bold active:scale-95">Cancel</button>
                            <h2 className="font-display font-black tracking-tight text-lg">New Post</h2>
                            <button onClick={handleCreatePost} className="text-[#3b82f6] font-bold active:scale-95">Share</button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="flex gap-4 p-4 border-b border-white/10">
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                                    <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80" alt="You" className="w-full h-full object-cover" />
                                </div>
                                <textarea
                                    className="flex-1 bg-transparent text-white placeholder-white/40 resize-none outline-none font-medium mt-1 text-sm min-h-[80px]"
                                    placeholder="Write a caption..."
                                    value={newPostCaption}
                                    onChange={(e) => setNewPostCaption(e.target.value)}
                                ></textarea>
                                <button className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0 border border-white/20 flex items-center justify-center text-white/40 hover:bg-white/20 active:scale-95 transition-all">
                                    <IcCamera size={24} />
                                </button>
                            </div>

                            <div className="px-5 py-4 space-y-4">
                                <button className="flex items-center gap-3 text-white/80 hover:text-white w-full active:scale-95 transition-transform">
                                    <span className="text-xl">📍</span>
                                    <span className="font-bold text-sm">Add Location</span>
                                    <span className="ml-auto opacity-50"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></span>
                                </button>
                                <button className="flex items-center gap-3 text-white/80 hover:text-white w-full active:scale-95 transition-transform">
                                    <span className="text-xl">👥</span>
                                    <span className="font-bold text-sm">Tag Classmates</span>
                                    <span className="ml-auto opacity-50"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
