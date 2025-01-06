/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        success: {
          light: "#d1fae5", // Light green
          DEFAULT: "#10b981", // Green
          dark: "#065f46", // Dark green
        },
        warning: {
          light: "#fef3c7", // Light yellow
          DEFAULT: "#f59e0b", // Yellow
          dark: "#92400e", // Dark yellow
        },
        failure: {
          light: "#fee2e2", // Light red
          DEFAULT: "#ef4444", // Red
          dark: "#991b1b", // Dark red
        },
      },
      keyframes: {
        slideDownHoldUp: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "20%": { transform: "translateY(0)", opacity: "1" },
          "80%": { transform: "translateY(0)", opacity: "1" }, // Hold position
          "100%": { transform: "translateY(-20px)", opacity: "0" },
        },
      },
      animation: {
        "slide-down-hold-up": "slideDownHoldUp 1.5s ease-in-out", // Quick in-out with a hold
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
