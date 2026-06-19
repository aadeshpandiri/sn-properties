/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F0D0B',     // Warm obsidian — site anchor, dark sections, headings
        secondary: '#2A2420',   // Dark espresso — hover state, clearly distinct
        accent: '#C8973C',      // Champagne gold — luxury signal, CTAs, highlights
        background: '#FEFCF8',  // Warm pearl — page background
        surface: '#F4EDE0',     // Warm linen — alternating sections, card backgrounds
        border: '#E5D9C7',      // Warm sand — card borders, dividers
        text: '#1C1917',        // Warm near-black — body text
        muted: '#9E8B77',       // Warm taupe — subtitles, meta, placeholders
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(15, 13, 11, 0.06), 0 1px 2px 0 rgba(15, 13, 11, 0.04)',
        hover: '0 20px 40px -8px rgba(15, 13, 11, 0.20), 0 4px 8px -2px rgba(15, 13, 11, 0.08)',
      },
    },
  },
  plugins: [],
};
