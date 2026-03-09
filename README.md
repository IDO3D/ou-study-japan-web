# 🗾 OUStudyJapan — Travel Assistant App

A cinematic, premium travel assistant app for University of Oklahoma students studying abroad in Japan. Features camera-based Japanese translation via OCR, food discovery, interactive maps, budget tracking, and gamified quests.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment config
cp .env.local .env.local
# Then edit .env.local with your API keys (see below)

# 3. Run development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

---

## 📱 iPhone / Mobile Testing with ngrok

```bash
# Install ngrok (if not installed)
brew install ngrok        # macOS
# OR: https://ngrok.com/download

# Authenticate (free account)
ngrok config add-authtoken YOUR_NGROK_TOKEN

# In terminal 1: Start Next.js
npm run dev

# In terminal 2: Expose to internet
ngrok http 3000
```

ngrok will output a URL like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

Open `https://abc123.ngrok-free.app` on your iPhone Safari to test the full app including camera.

> **Important**: Use the `https://` URL (not http) for camera access on iPhone Safari.

---

## 🔑 API Keys Setup

Edit `.env.local`:

### 1. Mapbox (Interactive Maps)
- Go to https://account.mapbox.com/access-tokens/
- Create a new token (free tier: 50,000 loads/month)
- Add to `.env.local`:
```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNs...
```

### 2. DeepL Translation (Camera OCR Translation)
- Go to https://www.deepl.com/pro-api (free tier: 500,000 chars/month)
- Create account → Get API key
```
DEEPL_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx
```
> **Note**: The app works WITHOUT a DeepL key using a built-in mock translation dictionary covering common Japanese food/transit terms.

### 3. Exchange Rate API (Live JPY/USD)
- Go to https://app.exchangerate-api.com/ (free tier: 1,500 requests/month)
```
NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=your_key_here
```
> **Note**: Falls back to ¥149/$1 if key not provided.

### 4. PostgreSQL (Optional — app works without it)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/oustudyjapan
```

To set up the database:
```bash
createdb oustudyjapan
psql -U postgres -d oustudyjapan -f database/schema.sql
```

---

## 🏗️ Project Structure

```
oustudyjapan/
├── pages/
│   ├── _app.js              # App wrapper + Toast provider
│   ├── _document.js         # HTML head (fonts, meta, PWA)
│   ├── index.js             # Main router + data loading
│   └── api/
│       ├── translate.js     # DeepL translation endpoint
│       ├── restaurants.js   # Restaurant data (DB or mock)
│       ├── quests.js        # Quest data (DB or mock)
│       └── exchange-rate.js # Live JPY/USD rate
│
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx     # Mobile app container
│   │   ├── Header.jsx       # Glassmorphism header
│   │   └── Navigation.jsx   # Floating bottom nav
│   ├── HomeView.jsx         # Dashboard (budget, quests, nearby)
│   ├── CameraView.jsx       # OCR camera + manual translation
│   ├── DiscoverView.jsx     # Restaurant discovery + filters
│   ├── MapView.jsx          # Mapbox interactive map
│   ├── QuestsView.jsx       # Gamified quests + progress
│   └── ProfileView.jsx      # User profile + achievements
│
├── utils/
│   ├── store.js             # Zustand global state
│   └── helpers.js           # Currency, geolocation, date utils
│
├── database/
│   ├── db.js                # PostgreSQL connection
│   └── schema.sql           # Database schema + seed data
│
├── styles/
│   └── globals.css          # Design system (glass, animations, etc.)
│
├── .env.local               # Environment variables
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## ✨ Features

| Feature | Status | Notes |
|---------|--------|-------|
| 🏠 Hero Dashboard | ✅ | Budget card, quick actions, nearby food |
| 📸 Camera Translation | ✅ | Tesseract.js OCR → DeepL API |
| 🍜 Food Discovery | ✅ | Filter by category, budget, student-friendly |
| 🗺️ Interactive Map | ✅ | Mapbox with restaurant + transit markers |
| 🎯 Quest System | ✅ | Gamified exploration with point rewards |
| 👤 User Profile | ✅ | Budget settings, achievements, stats |
| 💴 Currency Converter | ✅ | Live JPY/USD rate, dual display everywhere |
| 🌙 Dark Mode | ✅ | Cinematic dark-only design |
| 📱 Mobile Optimized | ✅ | Touch UI, safe areas, iOS camera |
| 🇯🇵 Japanese Scripts | ✅ | Hiragana, Katakana, Kanji detection |

---

## 🎨 Tech Stack

- **Next.js 14** — React framework with API routes
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Spring animations
- **Tesseract.js** — Client-side OCR for Japanese text
- **DeepL API** — Professional Japanese-English translation
- **Mapbox GL JS** — Interactive map with custom markers
- **Zustand** — Lightweight global state management
- **PostgreSQL + pg** — Database (optional, falls back to mock data)
- **react-hot-toast** — Toast notifications

---

## 🔧 Camera Usage on iPhone

1. Open the app via the ngrok https:// URL
2. Navigate to the **Scan** tab (⊡ icon)
3. Tap **📸 Camera** button
4. **Allow camera access** when prompted
5. Point the camera at Japanese text (menus, signs, packages)
6. Tap the large capture button
7. Wait for OCR processing (~3-8 seconds)
8. View the English translation + romanization

> **Tip**: Good lighting significantly improves OCR accuracy. Natural light or bright indoor lighting works best.

---

## 🌐 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel (recommended)
npx vercel
```

Add environment variables in your Vercel project settings.

---

## 🐛 Troubleshooting

**Camera not working on iPhone:**
- Must use `https://` URL (ngrok provides this)
- Go to Safari Settings → allow camera for the domain
- Check Settings → Privacy & Security → Camera → Safari

**Map not loading:**
- Add your Mapbox public token to `.env.local`
- Token must start with `pk.`
- Restart the dev server after adding env vars

**Translation not working:**
- App includes a mock dictionary — works without DeepL key
- For full coverage, add DeepL API key
- Free tier = 500,000 characters/month

**Slow OCR processing:**
- Normal on first use (Tesseract loads language models ~15MB)
- Subsequent scans are faster
- Works entirely client-side, no server required for OCR

---

Built with ❤️ for OU Study Abroad Students 🎓🗾
