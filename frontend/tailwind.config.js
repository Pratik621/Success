/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#f97316', dark: '#ea580c' },
        dark: { DEFAULT: '#1e293b', light: '#334155' },
      },
    },
  },
  plugins: [],
};
