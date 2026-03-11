// utils/store.js
import { create } from 'zustand'

const useStore = create((set, get) => ({
  // ─── User ───────────────────────────────
  user: {
    id: 'demo-user',
    name: 'Alex',
    email: 'alex@ou.edu',
    university: 'University of Oklahoma',
    points: 2450,
    dailyBudgetJpy: 4500,
    homeCurrency: 'USD',
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
  },
  setUser: (userData) => set(s => ({ user: { ...s.user, ...userData } })),

  // ─── Theme ──────────────────────────────
  // 'dark' | 'japan' | 'ou' | 'business'
  theme: 'dark',
  setTheme: (theme) => set({ theme }),

  // ─── Exchange Rate ───────────────────────
  exchangeRate: 0.0067,
  setExchangeRate: (rate) => set({ exchangeRate: rate }),

  // ─── Location ───────────────────────────
  userLocation: { lat: 35.6595, lng: 139.7004 },
  setUserLocation: (loc) => set({ userLocation: loc }),

  // ─── Navigation ─────────────────────────
  currentView: 'home',
  setView: (view) => set({ currentView: view }),

  // ─── Nav Mode (for map navi overlay) ────
  naviMode: false,
  naviTarget: null,
  naviTransportMode: 'walk',
  setNaviMode: (active, target = null) => set({ naviMode: active, naviTarget: target }),
  setNaviTransportMode: (mode) => set({ naviTransportMode: mode }),

  // ─── Restaurants ────────────────────────
  restaurants: [],
  setRestaurants: (restaurants) => set({ restaurants }),

  // ─── Quests ─────────────────────────────
  quests: [],
  completedQuests: new Set(),
  setQuests: (quests) => set({ quests }),
  completeQuest: (questId, points) => {
    const { completedQuests, user } = get()
    const newCompleted = new Set(completedQuests)
    newCompleted.add(questId)
    set({ completedQuests: newCompleted, user: { ...user, points: user.points + points } })
  },

  // ─── Translation ────────────────────────
  lastTranslation: null,
  setLastTranslation: (t) => set({ lastTranslation: t }),

  // ─── Expenses ────────────────────────────
  todayExpenses: [],
  addExpense: (expense) => set(s => ({ todayExpenses: [...s.todayExpenses, expense] })),
  getTodaySpent: () => get().todayExpenses.reduce((sum, e) => sum + e.amount_jpy, 0),

  // ─── Notifications ──────────────────────
  notifications: [],
  addNotification: (notif) => set(s => ({
    notifications: [{ id: Date.now(), ...notif }, ...s.notifications].slice(0, 20)
  })),
}))

export default useStore
