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
        textcolor: "#E6FCFC",
        icon: "#B4E3E3",
        lightaccent: "#77D7D7",
        logo: "#39CCCC",
        darkestcolor: "#327B7B",
        nav: "#003135",
        background: "#2A2A2A",
        input: "#FFFFFF",
        bg2: "#4F4F4F"
      },
      backgroundImage: {
        'light-btn': "linear-gradient(to bottom, #B4E3E3, #77D7D7)",
        'btn': "linear-gradient(to bottom, #327B7B, #39CCCC)",
      },
      fontFamily: {
        robotoMono: ['"Roboto Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
};
export default config;
