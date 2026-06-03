/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#fdbf00',
          500: '#e8a921',
          600: '#ca7312',
        },
        ink: {
          DEFAULT: '#000000',
          soft: '#080806',
          2: '#111110',
          3: '#1a1a18',
        },
        chalk: '#f4f0e8',
        paper: '#ede8dc',
        dust:  '#888878',
        fog:   '#c0bdb0',
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', 'sans-serif'],
        body:    ['"Satoshi"', 'sans-serif'],
        serif:   ['"Zodiak"', 'serif'],
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}