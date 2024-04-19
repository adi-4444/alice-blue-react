/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.html",
    "./src/**/*.js",
    "./src/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        'heading': '#44475b',
        'description': " #7c7e8c",
        'dark-green': '#00b386',
        'light-green': '#66e3c4',
        'btn-green': '#00D09C',
        'input-bg-green1': '#E5FAF5',
        'input-bg-green2': '#ebf9f5',
      },
    },
  },
  plugins: [],
}
