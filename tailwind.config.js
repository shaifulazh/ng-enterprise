/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde8ff',
          200: '#c2d4ff',
          300: '#9ab5fd',
          400: '#6e8dfa',
          500: '#4a63f5',
          600: '#3344e8',
          700: '#2a35cc',
          800: '#2530a5',
          900: '#242f82',
          950: '#161a4e',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          dark:  '#0f1117',
          'dark-secondary': '#161b27',
          'dark-tertiary':  '#1e2535',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in':  'fadeIn 0.15s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      transitionProperty: {
        'sidebar': 'width, transform, opacity',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
