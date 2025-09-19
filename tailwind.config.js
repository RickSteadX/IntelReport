/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Updated brighter military tactical theme colors
        'tactical-black': '#0A0C0A',
        'tactical-dark': '#1A1E1A',
        'tactical-green': {
          900: '#0D2D0D',
          800: '#1A4D1A', // Brightened
          700: '#246024', // Brightened
          600: '#2D732D', // Brightened
          500: '#348834', // Brightened
          400: '#42A142', // Brightened
          300: '#55B955', // Brightened
          200: '#6ED26E', // Brightened
          100: '#8AE88A', // Brightened
        },
        'tactical-accent': {
          red: '#FF4B40', // Brightened
          yellow: '#FFDC20', // Brightened
          blue: '#1A8AFF', // Brightened
          purple: '#9966FF', // Added purple
          cyan: '#00CCCC', // Added cyan
        },
        'tactical-bg': {
          dark: 'rgba(10, 12, 10, 0.85)',
          light: 'rgba(26, 30, 26, 0.7)',
        }
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hex-pattern': "url('/src/assets/hex-pattern.svg')",
        'grid-pattern': "url('/src/assets/grid-pattern.svg')",
        'crosshair-pattern': "url('/src/assets/crosshair-pattern.svg')",
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
      },
      padding: {
        'safe': '0.5rem',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}