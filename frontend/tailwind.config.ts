import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090d",
        card: "#0f121a",
        cardBorder: "#1c2233",
        brandPrimary: "#3b82f6",
        safeGreen: "#10b981",
        dangerRed: "#f43f5e",
        warningAmber: "#f59e0b",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        insetHighlight: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
