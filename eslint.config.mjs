import globals from 'globals';

export default [
  {
    ignores: ['**/vendor/**', '**/*.min.js'],
  },
  {
    files: ['DA{1,2,3,4,5}/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
        Phaser: 'readonly',
        PIXI: 'readonly',
      },
    },
    rules: {
      'no-console': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: 'error',
    },
  },
];
