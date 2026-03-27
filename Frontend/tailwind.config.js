/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sage': '#8BA888',     // Huzurlu Adaçayı Yeşili
        'wood': '#201d1a',     // Soft Toprak Kahvesi
        'navy': '#4A5D82',     // Yumuşak Lacivert
        'cream': '#F9F6F0'     // Arka planlar için yumuşak krem
      }
    },
  },
  plugins: [],
}