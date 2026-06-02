/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Injective Design System — design-md-injective
      colors: {
        "inj-midnight": "#182E4B",   // Primary — trust, institutional
        "inj-ocean":    "#4D3DFF",   // Secondary — energetic digital accent
        "inj-snow":     "#EEEFFF",   // Neutral — clean backdrop
        "inj-lime":     "#CEFFC8",   // Builder / hackathon accent
        "inj-sand":     "#D5C498",
        "inj-lemon":    "#E8FF5F",
        "inj-coral":    "#FFA36E",
        "inj-forest":   "#144E1A",   // Text on lime
        "inj-eggplant": "#611447",
        "inj-cinnamon": "#7A4515",
        "inj-turquoise":"#026585",
      },
      // Typography — ABC Marist (primary) / ABC Whyte (labels)
      fontFamily: {
        marist: ["ABC Marist", "Inter", "system-ui", "sans-serif"],
        whyte:  ["ABC Whyte",  "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display": ["3rem",   { lineHeight: "1.1",  fontWeight: "700" }],
        "body-md": ["1rem",   { lineHeight: "1.5",  fontWeight: "400" }],
        "label-sm":["0.75rem",{ lineHeight: "1.4",  fontWeight: "400" }],
      },
      // Spacing tokens
      spacing: {
        "inj-sm": "8px",
        "inj-md": "16px",
        "inj-lg": "24px",
        "inj-xl": "32px",
      },
      // Border radius tokens
      borderRadius: {
        "inj-none": "0px",
        "inj-sm":   "4px",
        "inj-md":   "8px",
        "inj-lg":   "16px",
        "inj-full": "9999px",
      },
    },
  },
  plugins: [],
};
