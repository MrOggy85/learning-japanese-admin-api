module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false,
    },
  },
  plugins: [
    'babel',
    'flowtype-errors',
    'flowtype',
  ],
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:flowtype/recommended',
  ],
  rules: {
    'max-len': 0,
    'prefer-destructuring': 0,
    'import/newline-after-import': 0,
    'arrow-body-style': 0,
    'object-curly-newline': 0,
    'arrow-parens': 0,
    'brace-style': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
    'no-underscore-dangle': 0,
    'lines-between-class-members': 0,

    'flowtype-errors/show-errors': 2,
  },
}
