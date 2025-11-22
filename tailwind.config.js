/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#6cf6ff',
        plasma: '#a855f7',
        midnight: '#0b1021',
        panel: '#0f172a',
      },
      boxShadow: {
        glow: '0 0 20px rgba(108, 246, 255, 0.5)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(108, 246, 255, 0.1) 1px, transparent 0)',
      }
    },
  },
  plugins: [],
};
