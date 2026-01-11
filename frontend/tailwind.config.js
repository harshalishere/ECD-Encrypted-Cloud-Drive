/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Important for the toggle
  theme: {
    extend: {
      colors: {
        // Your New Architectural Palette
        architect: {
          mustard: '#F2B418',  // Primary Action / Highlight
          ice: '#ECF8FD',      // Light Bg
          steel: '#AFCBD5',    // Secondary / Borders
          navy: '#272838',     // Dark Bg / Main Text
          mauve: '#815355',    // Muted Accent / Destructive
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}