/** @type {import('tailwindcss').Config} */
const sharedConfig = {
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        gold: {
          50: '#fff9eb', 100: '#fef1c7', 200: '#fde28a', 300: '#facc4c', 400: '#f5b826',
          500: '#e89f12', 600: '#d8890e', 700: '#845a07', 800: '#6f4908', 900: '#5b3b09', 950: '#321f05',
        },
        warm: {
          50: '#fdf8f0', 100: '#f8efe0', 200: '#efdfc6', 300: '#e3c9a5', 400: '#d3ab7c',
          500: '#c48f5e', 600: '#a9724a', 700: '#8b5d3f', 800: '#724d39', 900: '#5f4133',
        },
      },
      boxShadow: {
        'ks-xs': '0 1px 2px rgb(26 22 15 / 0.08)',
        'ks-sm': '0 2px 8px rgb(26 22 15 / 0.08)',
        'ks-md': '0 8px 20px rgb(26 22 15 / 0.08)',
        'ks-lg': '0 16px 36px rgb(26 22 15 / 0.1)',
        'ks-xl': '0 24px 54px rgb(26 22 15 / 0.12)',
        'ks-gold': '0 10px 30px rgb(132 90 7 / 0.2)',
        'ks-gold-lg': '0 20px 45px rgb(132 90 7 / 0.24)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        'fade-in': 'fadeIn .25s ease-out',
        'slide-up': 'slideUp .3s ease-out',
        'slide-down': 'slideDown .3s ease-out',
        'scale-in': 'scaleIn .2s ease-out',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #fef1c7 0%, #fde28a 100%)',
        'hero-gradient': 'radial-gradient(circle at 0% 0%, #fde28a 0%, #fdf8f0 48%, #f8efe0 100%)',
        'admin-gradient': 'linear-gradient(180deg, #fff9eb 0%, #f8efe0 100%)',
        'mesh-gold': 'radial-gradient(at 20% 20%, #fde28a55 0px, transparent 50%), radial-gradient(at 80% 10%, #facc4c44 0px, transparent 50%), radial-gradient(at 50% 80%, #efdfc666 0px, transparent 55%)',
      },
    },
  },
};

module.exports = sharedConfig;
