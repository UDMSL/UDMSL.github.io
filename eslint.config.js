import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

let tsParser
try {
  // Attempt to load the TypeScript parser; if unavailable (offline installs), gracefully fall back
  tsParser = (await import('@typescript-eslint/parser')).default
} catch {
  tsParser = undefined
}

const filePatterns = tsParser ? ['**/*.{js,jsx,ts,tsx}'] : ['**/*.{js,jsx}']
const ignoredPatterns = tsParser ? [] : ['**/*.ts', '**/*.tsx']

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: filePatterns,
    ignores: ignoredPatterns,
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
      parser: tsParser,
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
])
