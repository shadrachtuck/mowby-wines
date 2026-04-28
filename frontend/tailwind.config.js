/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './wp-templates/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'mowby': {
          cream: '#fffbeb',
          'cream-hover': '#fff1c2',
          /** Official palette + hovers */
          'sea-lemon': '#DAB205',
          'sea-lemon-dark': '#b89404',
          coral: '#ECB6E6',
          'coral-dark': '#e0a0d8',
          /** Theme primary (Surf Blue) — same as default `Button` / links */
          blue: '#3B92CE',
          'blue-dark': '#2d7ab8',
          seaweed: '#66A25F',
          'seaweed-dark': '#558a4f',
          'red-fishy': '#CA4022',
          'red-fishy-dark': '#a8361c',
          /** Active nav pill — Seaweed Green */
          'nav-pill': '#66A25F',
          /** Accent yellow (highlights) — Sea Lemon */
          yellow: '#DAB205',
          'newsletter-input': '#ffe8a3',
          /** Focus / active field highlight (forms) */
          mustard: '#FCE19B',
        },
      },
      fontFamily: {
        display: ['\'Patrick Hand SC\'', 'cursive'],
        sans: ['\'Rethink Sans\'', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Only two fonts: display (headings) + sans (body)
        serif: ['\'Patrick Hand SC\'', 'cursive'],
      },
      boxShadow: {
        /** Subtle elevation instead of grey hairline borders on cards / forms */
        'mowby-soft':
          '0 2px 8px -2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        /** Fixed nav bar — soft drop shadow below */
        'mowby-nav':
          '0 4px 14px -4px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
