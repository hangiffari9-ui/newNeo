/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f1218",
        surface: "#1a1f2b",
        primary: "#b8ff3b", // Neon Green 1
        secondary: "#8cff5a", // Neon Green 2
        text: {
          main: "#e2e8f0",
          muted: "#94a3b8"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(184, 255, 59, 0.3), 0 0 20px rgba(184, 255, 59, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
