import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2A41",
        inkdeep: "#11203A",
        paper: "#FAFAF7",
        slatey: "#5B6B7F",
        line: "#E3E2DA",
        signal: "#E8A33D",
        right: "#2E7D5B",
        wrong: "#C24E42",
      },
      fontFamily: {
        display: ["Archivo", "system-ui", "sans-serif"],
        body: ["'Public Sans'", "system-ui", "sans-serif"],
        mono: ["'Spline Sans Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
