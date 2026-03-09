# OUStudyJapan — Production Deployment Guide

## Live site: https://oujapanapp.us/

## Stack
- Next.js 14 · React 18 · Tailwind CSS 3
- Framer Motion · Zustand · react-hot-toast
- Tesseract.js (OCR) · Mapbox GL JS
- Custom SVG icon system (no emoji)

## Local Dev
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Production Build
```bash
npm run build
npm start
```

## Environment Variables (.env.local)
```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token
NEXT_PUBLIC_DEEPL_API_KEY=your_deepl_key
NEXT_PUBLIC_EXCHANGE_API_KEY=your_exchangerate_key
DATABASE_URL=postgresql://user:pass@host:5432/oustudyjapan
```
All features work without API keys (mock data fallbacks active).

## Deploy to oujapanapp.us (Vercel / Node server)

### Vercel (recommended)
```bash
npm i -g vercel
vercel --prod
```
Set env vars in Vercel dashboard → Settings → Environment Variables.

### Manual Node server
```bash
npm run build
PORT=3000 npm start
```
Use nginx as reverse proxy:
```nginx
server {
    listen 443 ssl;
    server_name oujapanapp.us;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Features (v3)
- 7-tab navigation: Home, Scan, Map, Quests, Canvas, Stay, Profile
- Custom SVG icon system — zero emojis
- Halal food filter with certified restaurant database
- Wallet: Suica IC card, Apple/Google Pay, ATM locator
- Health & Safety: hospitals, allergies, emergency phrases
- SIM Card comparison: IIJmio, Sakura Mobile, Mobal, Airalo
- Finance: live JPY/USD converter, daily budget template
- Photo Reel: cinematic slideshow of trip photos
- Auth: sign in / sign up / sign out
- Full PWA: works offline, adds to home screen
- Mobile-first: safe-area-inset, iOS status bar support

## Halal Restaurants
Includes 6 halal-certified spots across Tokyo/Kyoto/Osaka:
- Naritaya Halal Ramen (Japan Halal Association certified)
- Gyukatsu Saku Halal (Muslim Pro Verified)
- Magal Korean BBQ Halal (Japan Islamic Trust)
- Curry House CoCo Halal (CoCo certified branch)
- Marugame Seimen Halal (Halal Media Japan)
- Yakitori Halal Ginza (JHFA Certified)
