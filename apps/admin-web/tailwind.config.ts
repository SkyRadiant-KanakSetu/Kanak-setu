import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8ef',
          100: '#faefd5',
          200: '#f4dcaa',
          300: '#ecc474',
          400: '#e2a33c',
          500: '#d98c1f',
          600: '#c07016',
          700: '#a05415',
          800: '#834318',
          900: '#6c3816',
        },
        temple: { 50: '#fef2f2', 500: '#ef4444', 700: '#b91c1c' },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
