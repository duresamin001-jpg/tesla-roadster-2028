/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        roadster: {
          bg: '#FFFFFF',
          primary: '#007BFF',
          primaryHover: '#0062cc',
          text: '#14213D',
          card: '#F0F7FF',
          cardHover: '#E1EFFF',
          accent: '#00BFFF',
          border: '#E5E7EB',
          subtle: '#64748B',
          darkStudio: '#0B0F19'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        arabic: ['Cairo', 'Noto Sans Arabic', 'Tahoma', 'sans-serif']
      }
    },
  },
  plugins: [],
}
