import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  rules: {
    // Vue-specific rules
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    // TypeScript-specific rules - make them warnings instead of errors
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // Other common rules
    'no-useless-catch': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
  },
})
