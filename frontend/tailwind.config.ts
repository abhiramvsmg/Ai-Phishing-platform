import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0E27", // Deep navy
        surface: "#0F1A3F",    // Elevated surface
        card: "#151E3F",       // Card background
        primary: "#00D9FF",    // Bright cyan
        secondary: "#6B5EFF",  // Purple accent
        success: "#10B981",    // Safe green
        warning: "#F59E0B",    // Suspicious amber
        danger: "#EF4444",     // Malicious red
        muted: "#9CA3AF",      // Secondary text
        border: "#1E2A4F",     // Subtle borders
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00D9FF 0%, #6B5EFF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0A0E27 0%, #1A1535 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, rgba(107, 94, 255, 0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 217, 255, 0.4)',
        'glow-purple': '0 0 20px rgba(107, 94, 255, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 217, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;