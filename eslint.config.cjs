module.exports = [
  {
    ignores: ['.cursor/', 'node_modules/', 'playwright-report/', 'dist/'],
  },
  {
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      // TypeScript plugin recommended rules are enabled by referencing their rule names directly if desired.
    },
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: {
        test: 'readonly',
        expect: 'readonly',
        page: 'readonly',
      },
    },
  },
];
