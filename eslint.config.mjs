// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Relax for POC project - allow any types during rapid prototyping
    '@typescript-eslint/no-explicit-any': 'warn',
    // Allow unused vars with underscore prefix
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
})
