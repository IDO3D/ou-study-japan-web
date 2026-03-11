# OUStudyJapan v5

Production-ready travel companion app for OU Study Abroad Japan program.

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in your API keys
npm run dev                   # → http://localhost:3000
```

## Deploy to Vercel

```bash
npm run build && npm start    # test production build
npx vercel --prod             # deploy
```

## Environment Variables

Set these in Vercel → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | CRITICAL | Supabase pooler URI (not localhost!) |
| `NEXT_PUBLIC_SUPABASE_URL` | CRITICAL | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | CRITICAL | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | CRITICAL | Server-only service key |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | HIGH | Mapbox `pk.*` token for 3D maps |
| `DEEPL_API_KEY` | MEDIUM | DeepL API for translations |
| `EXCHANGE_RATE_API_KEY` | LOW | ExchangeRate-API.com key |

## Features (v5)

- **Navigation Mode** — Apple Maps-style with Walk/Bike/Transit/Drive/Taxi
- **AI Translate** — Camera OCR, Voice AI Agent (JLPT N1), Live AR overlay
- **Discover** — Full restaurant profiles with menus, deals, ratings, navi
- **Quests** — Top 50 things to do, Nearby, OU Program (50 total)
- **Stay** — Airbnb-quality property pages with 3D Mapbox + area info
- **Canvas Bridge** — OU Canvas LMS integration with grades and calendar
- **4 Themes** — Midnight Dark, Sakura Japan, OU Crimson, Carbon Business
- **Mobile-First** — iOS/Android safe-area, dvh viewport, no scale bugs

## v5 Fixes Applied

- [x] `isLoggedIn = false` — auth no longer bypassed on first load
- [x] `swcMinify` removed — no more Next 14 build warning
- [x] `favicon.ico` created — no more 404 on every page load
- [x] `manifest.json` added — PWA installable
- [x] Font `@import` moved to `_document.js` — no render-blocking CSS
- [x] DB pool serverless-optimized — connection timeout + max 2 in prod
- [x] Exchange rate API hardened — AbortSignal timeout, proper fallback
- [x] All POI map icons are SVG — no blank emoji
- [x] All UI icons are SVG — zero platform emoji dependency
- [x] Schema migrations for tutorial_completed, halal, deals, theme
- [x] `viewport-fit=cover` + `maximum-scale=1` — no iOS zoom on input

## Database Setup (Supabase)

1. Create project at supabase.com
2. Go to SQL Editor → paste `database/schema.sql` → Run
3. Copy **Supabase URL** and **Anon Key** to Vercel env vars
4. Copy **Pooler Connection String** as `DATABASE_URL`
