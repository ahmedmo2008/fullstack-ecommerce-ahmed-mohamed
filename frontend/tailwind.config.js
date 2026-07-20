/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#241B26',
        bone: '#F3EFE6',
        brass: '#C9A227',
        sage: '#7C8B6F',
        rust: '#B5502F',
        stone: '#D8D0BF',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        tag: '2px',
      },
    },
  },
  plugins: [],
};
