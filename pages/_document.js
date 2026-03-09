// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ── PWA & App Identity ────────────────────── */}
        <meta name="application-name" content="OU Study Japan" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="OUJapan" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#09090b" />
        <meta name="msapplication-TileColor" content="#841617" />
        <meta name="format-detection" content="telephone=no" />

        {/* ── SEO ───────────────────────────────────── */}
        <meta name="description" content="OU Study Abroad Japan Program — navigation, translation, dining, housing and campus tools for University of Oklahoma students in Japan." />
        <meta name="keywords" content="OU Study Abroad, Japan, University of Oklahoma, travel app, Tokyo, Kyoto, Osaka" />
        <meta property="og:title" content="OU Study Japan" />
        <meta property="og:description" content="Your all-in-one companion for the OU Japan Study Abroad Program." />
        <meta property="og:image" content="https://oujapanapp.us/icons/icon.svg" />
        <meta property="og:url" content="https://oujapanapp.us" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* ── PWA Manifest & Icons ──────────────────── */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />

        {/* ── Fonts — Premium Stack ─────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+JP:wght@300;400;500;700&family=Playfair+Display:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body style={{ background: '#09090b', margin: 0 }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
