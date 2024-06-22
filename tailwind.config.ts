import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        'bouncy': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      },
      colors: {
        deep: "var(--deep-black)",
        container: "var(--container)",
        copper: "var(--copper)",
        "copper-dark": "var(--copper-dark)",
        color: "var(--color)",
        border: 'var(--border)'
      },
      fontFamily: {
        sans: ["var(--font)", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
