/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'gold': '#FFD700',
      },
      boxShadow: {
        'glow': '0 8px 25px rgba(255, 215, 0, 0.4)',
        'glow-strong': '0 12px 35px rgba(255, 215, 0, 0.6)',
      },
      textShadow: {
        'glow': '0 0 30px rgba(255, 215, 0, 0.5)',
      },
    },
  },
  plugins: [],
}