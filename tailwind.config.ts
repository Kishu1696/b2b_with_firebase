import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Geist", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      colors: {
        background: "#0B1020",
        surface: "#121A2D",
        card: "#18233D",
        primary: "#082466",
        secondary: "#3B82F6",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        muted: "#94A3B8",
        border: "#27324B"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(59, 130, 246, 0.18)",
        panel: "0 18px 60px rgba(0, 0, 0, 0.32)"
      }
    }
  },
  plugins: []
} satisfies Config;
