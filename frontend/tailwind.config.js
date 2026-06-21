/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Deep medical teal — primary brand color, conveys calm + trust
        teal: {
          50: "#EAF5F4",
          100: "#CFE8E6",
          200: "#A0D1CC",
          300: "#6FB8B1",
          400: "#3F9F96",
          500: "#0E7C7B",
          600: "#0B6564",
          700: "#0A5C5B",
          800: "#073F3E",
          900: "#052827",
        },
        // Warm amber — accent for CTAs and highlights, brings human warmth
        amber: {
          50: "#FEF6EC",
          100: "#FCE7CC",
          200: "#F9D29F",
          300: "#F6BD72",
          400: "#F4A259",
          500: "#EE8B30",
          600: "#D5721C",
          700: "#A85A16",
        },
        ink: {
          50: "#F7FAF9",
          100: "#EEF3F2",
          400: "#5B6B69",
          700: "#27403E",
          800: "#16302E",
          900: "#0D1B1A",
        },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(13, 27, 26, 0.04), 0 8px 24px -8px rgba(13, 27, 26, 0.10)",
        "card-hover": "0 1px 2px rgba(13, 27, 26, 0.06), 0 16px 32px -12px rgba(13, 27, 26, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
