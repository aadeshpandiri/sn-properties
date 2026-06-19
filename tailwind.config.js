/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#18181B',    // zinc-900: warm charcoal — replaces cold navy
        secondary: '#3F3F46',  // zinc-700: clearly distinct hover state
        accent: '#D97706',     // amber-600: rich true gold — replaces dusty peach
        background: '#FFFFFF',
        surface: '#FAFAF9',    // stone-50: warm ivory — replaces cold blue-gray
        border: '#E7E5E4',     // stone-200: warm border — replaces cold border
        text: '#1C1917',       // stone-900: warm near-black — replaces cold navy text
        muted: '#78716C',      // stone-500: warm muted — replaces cold slate
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
        card: '0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        hover: '0 20px 40px -8px rgba(0, 0, 0, 0.18), 0 4px 8px -2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
