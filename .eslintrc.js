module.exports = {
  env: {
    node: true,
    jest: true,
    es2021: true
  },
  extends: ['prettier'],
  plugins: ['prettier', '@typescript-eslint/eslint-plugin'],
  rules: {
    'prettier/prettier': 'error'
  }
}
