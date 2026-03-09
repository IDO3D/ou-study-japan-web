// components/ui/Icons.jsx — Complete custom SVG icon library

const Icon = ({ size = 22, color = 'currentColor', strokeWidth = 1.75, children, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...p}>
    {children}
  </svg>
)

export const IcHome       = (p) => <Icon {...p}><path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></Icon>
export const IcFood       = (p) => <Icon {...p}><path d="M7 2v20M7 2C7 2 3 5 3 10h4M7 2c0 0 4 3 4 8H7"/><path d="M21 2v6a4 4 0 01-4 4v10"/></Icon>
export const IcCamera     = (p) => <Icon {...p}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></Icon>
export const IcMap        = (p) => <Icon {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></Icon>
export const IcStar       = (p) => <Icon {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>
export const IcBook       = (p) => <Icon {...p}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></Icon>
export const IcHotel      = (p) => <Icon {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V12a2 2 0 00-2-2h-4a2 2 0 00-2 2v9"/><path d="M2 10l10-7 10 7"/></Icon>
export const IcUser       = (p) => <Icon {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>
export const IcWallet     = (p) => <Icon {...p}><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/></Icon>
export const IcHeart      = (p) => <Icon {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></Icon>
export const IcPhone      = (p) => <Icon {...p}><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M15 2v6H9V2"/></Icon>
export const IcMoney      = (p) => <Icon {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Icon>
export const IcPlay       = ({ size = 22, color = 'currentColor', ...p }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" {...p}><polygon points="5 3 19 12 5 21 5 3"/></svg>
export const IcCheck      = (p) => <Icon strokeWidth={2.5} {...p}><polyline points="20 6 9 17 4 12"/></Icon>
export const IcX          = (p) => <Icon strokeWidth={2.5} {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>
export const IcChevron    = ({ dir = 'down', ...p }) => { const d = { down:'M6 9l6 6 6-6', up:'M18 15l-6-6-6 6', right:'M9 18l6-6-6-6', left:'M15 18l-6-6 6-6' }; return <Icon {...p}><polyline points={d[dir].replace('M','').split('l').map((s,i)=>i===0?s:s).join('L')}/><path d={d[dir]}/></Icon> }
export const IcSearch     = (p) => <Icon {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>
export const IcPin        = (p) => <Icon {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></Icon>
export const IcTrain      = (p) => <Icon {...p}><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><circle cx="8.5" cy="16.5" r="1"/><circle cx="15.5" cy="16.5" r="1"/><path d="M8 19l-2 2M16 19l2 2"/></Icon>
export const IcAlert      = (p) => <Icon {...p}><polygon points="12 2 22 21 2 21"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Icon>
export const IcImage      = (p) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></Icon>
export const IcArrow      = ({ dir = 'right', ...p }) => { const d = { right:'M5 12h14M12 5l7 7-7 7', left:'M19 12H5M12 19l-7-7 7-7', up:'M12 19V5M5 12l7-7 7 7', down:'M12 5v14M19 12l-7 7-7-7' }; return <Icon {...p}><path d={d[dir]}/></Icon> }
export const IcATM        = (p) => <Icon {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h2M12 15h5"/></Icon>
export const IcInfo       = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Icon>
export const IcSettings   = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></Icon>
export const IcGlobe      = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></Icon>
export const IcTrophy     = (p) => <Icon {...p}><path d="M6 9H4a2 2 0 01-2-2V5h4"/><path d="M18 9h2a2 2 0 002-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 9a6 6 0 0012 0V3H6v6z"/></Icon>
export const IcLogOut     = (p) => <Icon {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>
export const IcPlus       = (p) => <Icon strokeWidth={2.5} {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>
export const IcRefresh    = (p) => <Icon {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></Icon>
export const IcSend       = (p) => <Icon {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Icon>
export const IcShield     = (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>
export const IcDoc        = (p) => <Icon {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Icon>

// Special brand icons
export const IcHalal = ({ size = 20, color = '#22c55e', ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.75"/>
    <path d="M15.5 8.5A5 5 0 107 14" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
    <circle cx="18" cy="9" r="1.5" fill={color}/>
  </svg>
)

export const IcApple = ({ size = 20, color = 'currentColor', ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" {...p}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

export const IcGoogle = ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// OU wordmark
export const OUMark = ({ size = 36, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" {...p}>
    <rect width="80" height="80" rx="14" fill="#841617"/>
    <text x="40" y="56" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="700" fontSize="38" fill="white" letterSpacing="-1">OU</text>
  </svg>
)

// Torii gate
export const IcTorii = (p) => <Icon {...p}><line x1="2" y1="7" x2="22" y2="7"/><line x1="4" y1="4" x2="20" y2="4"/><line x1="7" y1="7" x2="7" y2="22"/><line x1="17" y1="7" x2="17" y2="22"/></Icon>

// Japan flag-inspired circle
export const IcJapan = ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...p}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.75"/>
    <circle cx="12" cy="12" r="4" fill="#E02424"/>
  </svg>
)
