/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00815d",
          hover: "#006b4d",
          light: "#eafaf1",
        },
        sidebar: "#1a3a4a",
        danger: "#e74c3c",
        success: "#27ae60",
        warning: "#f59e0b",
        muted: "#888",
        card: "#ffffff",
        background: "#e8ecef",
        border: "#e0e0e0",
        input: "#f0f2f5",
        text: {
          DEFAULT: "#333333",
          secondary: "#888888",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
