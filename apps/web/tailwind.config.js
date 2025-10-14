/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors' // <-- 1. Import default colors

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // 2. Define colors as an object, not a function
      colors: { 
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)'
        },
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        muted: colors.slate[500], // <-- 3. Reference the imported color directly
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(2, 6, 23, 0.08)'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    },
  },
  plugins: [],
}