/** @type {import('eslint').Linter.Config} */
module.exports = {
  name: '@semicons/config/eslint/base',
  ignores: ['dist/', 'node_modules/', '*.d.ts', '*.d.cts'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
  },
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',

    // General rules
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-console': 'warn',
    'no-debugger': 'warn',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],

    // Best practices
    'array-callback-return': 'error',
    'no-duplicate-imports': 'error',
    'no-self-compare': 'error',
    'no-useless-return': 'error'
  }
};
