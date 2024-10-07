import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        custom: {
          DEFAULT: '#1d4ed8', // Light mode primary color
          dark: '#3b82f6', // Dark mode primary color
        },

      },
    },
  },
  darkMode: 'media', // Enable dark mode using class strategy
  plugins: [],
} satisfies Config;
