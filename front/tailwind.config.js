import colors from 'tailwindcss/colors';

module.exports = {
  purge: ['./src/renderer/**/*.ts', './src/renderer/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
