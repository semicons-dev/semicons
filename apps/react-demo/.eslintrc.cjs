module.exports = {
  root: true,
  extends: '../../packages/config/eslint/react.cjs',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
