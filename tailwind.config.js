/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#E02424',
          dark: '#9B1C1C',
          light: '#FEF2F2',
          glow: 'rgba(224, 36, 36, 0.35)',
        },
        zen: {
          50: '#fafaf9',
          100: '#f5f5f4',
          900: '#0c0a09',
          950: '#080706',
        },
        sakura: '#FFB7C5',
        matcha: '#5B8A5E',
        indigo: {
          DEFAULT: '#4F46E5',
          glow: 'rgba(79, 70, 229, 0.35)',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(224, 36, 36, 0.4)',
        'glow-lg': '0 0 40px rgba(224, 36, 36, 0.3)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
        'glass-dark': '0 8px 32px rgba(0,0,0,0.5)',
        float: '0 20px 60px rgba(0,0,0,0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
