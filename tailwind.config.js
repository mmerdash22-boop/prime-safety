/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050608",
        surface: "#101216",
        surfaceAlt: "#171A20",
        border: "#262B33",
        gold: "#D9A62E",
        goldDeep: "#A97B12",
        goldLight: "#F2C94C",
        silver: "#C9D2DC",
        paper: "#F5F7FA",
        muted: "#8B94A3",
        success: "#2FBE6B",
        warn: "#E2A63B",
        danger: "#E4574F",
      },
      fontFamily: {
        display: ["Cairo", "sans-serif"],
        body: ["Tajawal", "sans-serif"],
      },
    },
  },
  plugins: [],
};
