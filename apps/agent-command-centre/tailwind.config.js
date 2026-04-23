/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0D12",
        surface: "#11151C",
        accent: "#FF5C00",
        muted: "#A0A9B8"
      },
      fontFamily: {
        heading: ["Cabinet Grotesk", "sans-serif"],
        body: ["Instrument Sans", "sans-serif"]
      }
    }
  },
  plugins: []
};
