/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        temple: {
          dark: '#0d0500',
          maroon: '#1a0a00',
          deep: '#2d1000',
          red: '#8B1A1A',
          gold: '#FFD700',
          saffron: '#FF6600',
          amber: '#FFA500',
          cream: '#FDE68A',
          light: '#FFF8E7',
        }
      },
      fontFamily: {
        devotional: ['Georgia', 'serif'],
        malayalam: ['Noto Sans Malayalam', 'sans-serif'],
      },
      animation: {
        'flicker': 'flicker 1.5s infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'petal-fall': 'petal-fall 6s linear infinite',
        'bell-ring': 'bell-ring 0.5s ease-in-out 3',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.95)' },
          '75%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px #FFD700, 0 0 40px #FF6600' },
          '50%': { boxShadow: '0 0 60px #FFD700, 0 0 100px #FF6600, 0 0 140px #FF8C00' },
        },
        'petal-fall': {
          '0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        'bell-ring': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(15deg)' },
          '75%': { transform: 'rotate(-15deg)' },
        }
      }
    }
  },
  plugins: []
}
