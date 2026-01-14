// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Warn on explicit any - use proper types or unknown
    // TODO: Upgrade to 'error' once all remaining any types are resolved
    '@typescript-eslint/no-explicit-any': 'warn',
    // Allow unused vars with underscore prefix
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  },
})
