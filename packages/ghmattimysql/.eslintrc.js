module.exports = {
  root: true,
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    project: './tsconfig.json',
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never',
      },
    ],
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
  },
  settings: {
    'import/extensions': ['.js','.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      'node': {
        'extensions': ['.js','.ts'],
      },
    },
  },
};
