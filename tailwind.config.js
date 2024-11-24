/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors : {
        primary: "#0f1114",
        secondary: "#111316",
        correctKey: "#4ede8c",
        incorrectKey: "#ed3438"
      },
    },
  },
  plugins: [],
}

