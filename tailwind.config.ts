import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: {
          light: "#f7f7f5",
          dark: "#0b0c0e",
        },
        surface: {
          light: "#ffffff",
          dark: "#141518",
        },
        border: {
          light: "#e7e5e4",
          dark: "#26282c",
        },
        ink: {
          light: "#1c1917",
          dark: "#f2f1ef",
        },
        muted: {
          light: "#6b7280",
          dark: "#9ca3af",
        },
        brand: {
          50: "#eef4ff",
          100: "#dce8ff",
          200: "#b8d1ff",
          300: "#8ab3ff",
          400: "#5c8fff",
          500: "#3468f6",
          600: "#234ed6",
          700: "#1c3dac",
          800: "#1a3488",
          900: "#182e6c",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.06)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at 20% -10%, rgba(52,104,246,0.16), transparent 55%)",
      },
    },
  },
  plugins: [],
};

export default config;
