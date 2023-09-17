module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'eslint:recommended'],
  plugins: ['@typescript-eslint', 'unused-imports'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    quotes: ['error', 'single'],

    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',

    'unused-imports/no-unused-imports-ts': 1,
  },
};
