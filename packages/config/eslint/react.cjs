/** @type {import('eslint').Linter.Config} */
module.exports = {
  name: '@semicons/config/eslint/react',
  plugins: {
    react: require('eslint-plugin-react'),
    'react-hooks': require('eslint-plugin-react-hooks')
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // React rules
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  overrides: [
    {
      files: ['**/*.jsx', '**/*.tsx'],
      rules: {
        'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }]
      }
    }
  ]
};
