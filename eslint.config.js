import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules/', 'tests/'],
  },
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        crypto: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        FileReader: 'readonly',
        Notification: 'readonly',
        matchMedia: 'readonly',
        requestAnimationFrame: 'readonly',
        isSecureContext: 'readonly',
        serviceWorker: 'readonly',
        self: 'readonly',
        caches: 'readonly',
        getComputedStyle: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        setInterval: 'readonly',
        setTimeout: 'readonly',
        Infinity: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
    },
  },
];
