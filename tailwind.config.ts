import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0a0a0f",
          card: "#161625",
          elevated: "#1a1a2e",
          border: "#2a2a4a",
          "border-light": "#1e1e3a",
        },
        accent: {
          DEFAULT: "#6366f1",
          light: "#a78bfa",
          purple: "#7c3aed",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
