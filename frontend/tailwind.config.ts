import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e9efff',
          200: '#c9d7ff',
          300: '#a3bbff',
          400: '#7e9fff',
          500: '#5a84ff',
          600: '#3f6af0',
          700: '#3153c2',
          800: '#283f91',
          900: '#213571',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
    },
  },
  plugins: [],
} satisfies Config;


