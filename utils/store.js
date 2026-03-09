// utils/store.js
import { create } from 'zustand'

const useStore = create((set, get) => ({
  // ─── User ───────────────────────────────
  user: {
    id: '',
    name: '',
    email: '',
    university: 'University of Oklahoma',
    major: '',
    year: '',
    points: 0,
    dailyBudgetJpy: 4500,
    homeCurrency: 'USD',
    avatarUrl: '',
  },
  setUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

  // ─── Theme ──────────────────────────────
  theme: 'dark',
  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('ou_theme', theme)
    }
    set({ theme })
  },


  // ─── In-App Navigation ──────────────────
  navDestination: null, // { name, lat, lng, icon }
  setNavDestination: (dest) => set({ navDestination: dest }),
  clearNavDestination: () => set({ navDestination: null }),


  exchangeRate: 0.0067, // JPY to USD
  setExchangeRate: (rate) => set({ exchangeRate: rate }),

  // ─── Location ───────────────────────────
  userLocation: { lat: 35.6595, lng: 139.7004 },
  setUserLocation: (loc) => set({ userLocation: loc }),

  // ─── Current View ───────────────────────
  currentView: 'home',
  setView: (view) => set({ currentView: view }),

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
    set({
      completedQuests: newCompleted,
      user: { ...user, points: user.points + points },
    })
  },

  // ─── Translation ────────────────────────
  lastTranslation: null,
  setLastTranslation: (t) => set({ lastTranslation: t }),

  // ─── Expenses ────────────────────────────
  todayExpenses: [],
  addExpense: (expense) => {
    const { todayExpenses, user } = get()
    const spent = todayExpenses.reduce((sum, e) => sum + e.amount_jpy, 0) + expense.amount_jpy
    set({
      todayExpenses: [...todayExpenses, expense],
    })
  },
  getTodaySpent: () => {
    const { todayExpenses } = get()
    return todayExpenses.reduce((sum, e) => sum + e.amount_jpy, 0)
  },

  // ─── Notifications ──────────────────────
  notifications: [],
  addNotification: (notif) => {
    const { notifications } = get()
    set({ notifications: [{ id: Date.now(), ...notif }, ...notifications].slice(0, 20) })
  },
}))

export default useStore
