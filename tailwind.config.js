/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        caveat: ['Caveat', 'cursive'],
        mono: ['Space Mono', 'monospace'],
        display: ['Bricolage Grotesque', 'sans-serif'],
        newsreader: ['Newsreader', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
};
