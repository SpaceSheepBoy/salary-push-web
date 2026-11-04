/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkbg: '#091417',
        cardbg: '#0E2024',
        cardborder: '#1F3238',
        coral: '#E77579',
        cyanaccent: '#58BEDD',
        mint: '#2EE69B',
        amberbadge: '#FBBF24',
        lavender: '#C084FC',
        grayteal: '#769096',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
