// Конфигурация ESLint (flat config, ESLint 10).
// Набор правил — локальная копия eslint-config-airbnb-base,
// см. eslint-config/airbnb-base/README.md.
const stylistic = require('@stylistic/eslint-plugin');
const importX = require('eslint-plugin-import-x');
const globals = require('globals');

const bestPractices = require('./eslint-config/airbnb-base/best-practices');
const errors = require('./eslint-config/airbnb-base/errors');
const node = require('./eslint-config/airbnb-base/node');
const style = require('./eslint-config/airbnb-base/style');
const variables = require('./eslint-config/airbnb-base/variables');
const es6 = require('./eslint-config/airbnb-base/es6');
const imports = require('./eslint-config/airbnb-base/imports');
const strict = require('./eslint-config/airbnb-base/strict');

module.exports = [
  {
    ignores: [
      'docs/**',
      'test/test-data-builder/js/vue.min.js',
      // сторонний код, скопированный как есть
      'eslint-config/airbnb-base/**',
    ],
  },
  {
    name: 'airbnb-base',
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@stylistic': stylistic,
      'import-x': importX,
    },
    settings: {
      'import-x/resolver-next': [
        importX.createNodeResolver({ extensions: ['.mjs', '.js', '.json'] }),
      ],
      'import-x/extensions': ['.js', '.mjs', '.jsx'],
      'import-x/core-modules': [],
      'import-x/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
    },
    // порядок как в index.js оригинального пакета
    rules: {
      ...bestPractices.rules,
      ...errors.rules,
      ...node.rules,
      ...style.rules,
      ...variables.rules,
      ...es6.rules,
      ...imports.rules,
      ...strict.rules,
    },
  },
  {
    name: 'lint-config-uses-dev-dependencies',
    files: ['eslint.config.js'],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
];
