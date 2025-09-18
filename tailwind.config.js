/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Military tactical theme colors
        'tactical-black': '#0A0C0A',
        'tactical-dark': '#1A1E1A',
        'tactical-green': {
          900: '#0D2D0D',
          800: '#133913',
          700: '#1A461A',
          600: '#205320',
          500: '#266026',
          400: '#347D34',
          300: '#429942',
          200: '#51B651',
          100: '#60D260',
        },
        'tactical-accent': {
          red: '#FF3B30',
          yellow: '#FFCC00',
          blue: '#007AFF',
        },
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hex-pattern': "url('/src/assets/hex-pattern.svg')",
        'grid-pattern': "url('/src/assets/grid-pattern.svg')",
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}