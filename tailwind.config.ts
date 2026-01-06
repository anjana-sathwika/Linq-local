/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2F5EEA",
        primaryDark: "#1E3FAE",
        accent: "#5FA9FF",
        background: "#F5F1E8",
        textMain: "#0F172A",
      },
      fontFamily: {
        sans: [
          "var(--font-sora)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        heading: [
          "var(--font-sora)",
          "ui-sans-serif",
          "system-ui",
        ],
      },
    },
  },
  plugins: [],
};
