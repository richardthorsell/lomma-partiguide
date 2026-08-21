import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#fafaf9",
        foreground: "#1c1917",
      },
    },
  },
  plugins: [],
};

export default config;
