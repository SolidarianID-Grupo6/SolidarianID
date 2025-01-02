module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}', // Incluye todas las rutas relevantes
    './public/**/*.html',             // Archivos estáticos HTML en public
    './views/**/*.hbs'                // Archivos Handlebars (si usas .hbs)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};