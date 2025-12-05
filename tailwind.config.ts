import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ghost-cyan': '#00E5FF',
        'ghost-cyan-light': '#5DF2FF',
        'ghost-navy': '#07141F',
        'ghost-navy-light': '#0C1C2A',
        'ghost-purple': '#2E2A44',
        'ghost-grid': '#1B3A4B',
        'ghost-text': '#E6F8FF',
        'ghost-muted': '#9BBBC7',
        // Keep existing ghost colors for backward compatibility if needed, or map them
        ghost: {
          bg: "#07141F",       // Mapped to ghost-navy
          card: "#2E2A44",     // Mapped to ghost-purple
          cyan: "#00E5FF",     // Mapped to ghost-cyan
          cyanSoft: "#5DF2FF", // Mapped to ghost-cyan-light
          grid: "#1B3A4B",     // Mapped to ghost-grid
          text: "#E6F8FF",     // Mapped to ghost-text
          muted: "#9BBBC7",    // Mapped to ghost-muted
        },
      },
      boxShadow: {
        glow: '0 0 25px rgba(0,229,255,0.45)',
        aura: '0 0 40px rgba(0,229,255,0.25)',
        'inner-glow': 'inset 0 0 20px rgba(0,229,255,0.15)',
        card: '0 0 12px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
