import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["JetBrainsMono", "monospace"], // Imposta JetBrainsMono come font principale
      },

      colors: {
        primary: {
          DEFAULT: "#27272A",
          foreground: "#FFFFFF",
        },
      },
    },
  },
  plugins: [heroui()],
};
