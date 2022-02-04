const path = require('path');

module.exports = {
  rules: {
    '@next/next/no-html-link-for-pages': [2, path.join(__dirname, 'pages')],
  },
  parserOptions: {
    projects: ['./tsconfig.json'],
    tsconfigRootdir: __dirname,
  },
  extends: ['next'],
}
