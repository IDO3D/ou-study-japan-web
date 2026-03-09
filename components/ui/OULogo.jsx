// components/ui/OULogo.jsx — Official University of Oklahoma Branding SVG
export default function OULogo({ size = 32, variant = 'mark' }) {
    if (variant === 'full') {
        // Horizontal lockup: mark + wordmark
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <OUMark size={size} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                    <span style={{
                        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: size * 0.45,
                        color: '#CC2124', letterSpacing: '-0.02em'
                    }}>
                        UNIVERSITY
                    </span>
                    <span style={{
                        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: size * 0.45,
                        color: 'white', letterSpacing: '-0.02em'
                    }}>
                        OF OKLAHOMA
                    </span>
                </div>
            </div>
        )
    }
    return <OUMark size={size} />
}

function OUMark({ size = 32 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Circle background */}
            <circle cx="20" cy="20" r="20" fill="#841617" />
            {/* OU letters */}
            <text
                x="50%" y="55%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="bold"
                fontSize="18"
                fill="white"
                letterSpacing="-0.5"
            >
                OU
            </text>
        </svg>
    )
}

// Torii Gate Icon (for Japan theme)
export function ToriiIcon({ size = 24, color = '#CC2124' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="7" width="20" height="2.5" rx="1.25" fill={color} />
            <rect x="4" y="5" width="16" height="2" rx="1" fill={color} opacity="0.7" />
            <rect x="4.5" y="9.5" width="2.5" height="11" rx="1.25" fill={color} />
            <rect x="17" y="9.5" width="2.5" height="11" rx="1.25" fill={color} />
        </svg>
    )
}
