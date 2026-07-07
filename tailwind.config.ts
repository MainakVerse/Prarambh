import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF9",
          100: "#FFF8F0",
          200: "#FAEFE2",
          300: "#F3E3CE",
        },
        primary: {
          50: "#FFF4EE",
          100: "#FFE6D8",
          200: "#FFC9AC",
          300: "#FFA876",
          400: "#FF8C42",
          500: "#FF6B35",
          600: "#EA5420",
          700: "#C13E12",
          800: "#9A320F",
        },
        accent: {
          100: "#FFF3D1",
          200: "#FFE79E",
          300: "#FFD23F",
          400: "#FFB627",
          500: "#F59E0B",
          600: "#B45309",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          soft: "#3F3F46",
          body: "#52525B",
          muted: "#71717A",
          faint: "#A1A1AA",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glass:
          "0 8px 32px rgba(154, 92, 32, 0.10), 0 2px 8px rgba(154, 92, 32, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.75)",
        "glass-lg":
          "0 20px 60px rgba(154, 92, 32, 0.14), 0 4px 16px rgba(154, 92, 32, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        neo: "8px 8px 20px rgba(196, 164, 128, 0.30), -8px -8px 20px rgba(255, 255, 255, 0.95)",
        "neo-sm": "4px 4px 12px rgba(196, 164, 128, 0.26), -4px -4px 12px rgba(255, 255, 255, 0.9)",
        "neo-xs": "2px 2px 6px rgba(196, 164, 128, 0.24), -2px -2px 6px rgba(255, 255, 255, 0.85)",
        "neo-inset":
          "inset 4px 4px 10px rgba(196, 164, 128, 0.22), inset -4px -4px 10px rgba(255, 255, 255, 0.9)",
        "neo-inset-sm":
          "inset 2px 2px 5px rgba(196, 164, 128, 0.20), inset -2px -2px 5px rgba(255, 255, 255, 0.85)",
        "glow-primary": "0 8px 30px rgba(255, 107, 53, 0.35)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
