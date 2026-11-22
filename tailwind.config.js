/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F5FF',
        ink: '#161823',
        muted: '#8A8B91',
        pink: '#FE2C55',
        green: '#00C853',
        lavender: '#F2EDFF',
        lavenderDeep: '#E9E0FF',
        banner: '#E7F1FF',
        hairline: '#EFEAF7',
        field: '#F3F0F8',
      },
    },
  },
  plugins: [],
};
