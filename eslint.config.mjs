import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginJest from 'eslint-plugin-jest';

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'jest': eslintPluginJest
    },
    rules: {
      // Reglas base de TypeScript
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
        { selector: 'enum', format: ['PascalCase'] }
      ],
      '@typescript-eslint/explicit-member-accessibility': ['error'],

      // Reglas para NestJS
      'max-classes-per-file': ['error', 1],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-duplicate-imports': 'error',
      'import/prefer-default-export': 'off',
      'implicit-arrow-linebreak': 'off',
      'class-methods-use-this': 'off',

      // Reglas para testing
      'jest/expect-expect': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/prefer-to-be': 'error',

      // Reglas de formato
      'max-len': ['error', { code: 100, ignoreComments: true }],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'eol-last': ['error', 'always'],

      // Reglas MongoDB/Mongoose
      'no-underscore-dangle': ['error', { allow: ['_id'] }],

      // Buenas prácticas
      'no-param-reassign': 'error',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
];