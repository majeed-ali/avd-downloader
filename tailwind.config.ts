import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        body: "#f3f4f6",
        header_bg: "#FFFFFE",
        purple_main: "#22d3ee",
        heading_main: "#2D3436",
        dark_heading_main: "#FFFFFF",
        base_one: "#4A5455",
        dark_base_one: "#b8b8b8",
        dark_body: "#121316",
        dark_heading: "#191a1d",
        partner: "#9ca3af"
      },
    },
    fontFamily: {
      league_spartan: ["var(--font-league_spartan_sans)"],
      inter: ["var(--font-inter)"],
    },
  },
  plugins: [],
};
export default config;
