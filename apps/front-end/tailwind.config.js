module.exports = {
  safelist: [
    'bg-red-500',
    'hover:bg-red-600',
    'text-gray-800',
    'text-teal-500',
    'hover:text-teal-300',
  ],
  content: [
    './src/**/*.{html,js,ts,jsx,tsx,hbs}',
    './views/**/*.hbs',
    './public/**/*.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
