/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {display: ["Anton", "Impact", "Arial Narrow", "sans-serif"], sans: ["Inter", "system-ui", "sans-serif"], mono: ["IBM Plex Mono", "ui-monospace", "monospace"]},
      colors: {paper: "#F4F3EE", ink: "#090909", acid: "#C9FF00", green: "#00E676", orange: "#FF563D", lavender: "#D8A7FF"},
      boxShadow: {brutal: "7px 7px 0 #090909", brutalSm: "4px 4px 0 #090909"},
    },
  },
  plugins: [],
};
