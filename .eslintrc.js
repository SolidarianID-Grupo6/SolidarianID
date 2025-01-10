module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'airbnb-typescript/base', // Se añadió el estilo de Airbnb para TypeScript
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Configuración de Prettier para autoformateo
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    es2021: true, // Agregado para asegurar que se usen las características de ECMAScript más recientes
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules'], // Añadimos dist y node_modules a los patrones ignorados
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off', // Desactivar la recomendación de prefixar interfaces con "I"
    '@typescript-eslint/explicit-function-return-type': 'off', // Puedes dejar esto desactivado si no deseas forzar tipos de retorno explícitos
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Desactivamos la necesidad de definir los tipos de módulos
    '@typescript-eslint/no-explicit-any': 'off', // Puedes dejar el uso de "any" libre, pero se recomienda tener cuidado
    'prettier/prettier': ['error'], // Para que Prettier valide el formato y emita un error si el código no está bien formateado
    'import/extensions': ['error', 'always', { ts: 'never', tsx: 'never' }], // Requiere extensión de archivos JS/TS
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Recomendación para no usar console.log en producción
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Permite el uso de variables con "_" para indicaciones de no uso
    'consistent-return': 'off', // Desactivar la regla que fuerza un retorno consistente en las funciones
    'no-shadow': ['error', { allow: ['resolve', 'reject'] }], // Evitar sombreado de variables, con excepciones para "resolve" y "reject"
  },
};
