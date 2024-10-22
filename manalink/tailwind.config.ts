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
        bg2: "#4F4F4F",
        bg3: "#3D3C3C",
        danger: "#590808",
        danger2: "#8b1c00",
        activeNav: "#007B7C"
      },
      backgroundImage: {
        'light-btn': "linear-gradient(to bottom, #B4E3E3, #77D7D7)",
        'btn': "linear-gradient(to top, #327B7B, #39CCCC)",
        'progressbar': "linear-gradient(to top, #4F4F4F, #B5B5B5)"
      },
      fontFamily: {
        robotoMono: ['"Roboto Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
};
export default config;
