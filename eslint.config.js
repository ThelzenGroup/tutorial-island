import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // Level modules intentionally co-locate their Sandbox component with the
    // level's data definition; fast-refresh boundaries don't apply here.
    files: ['src/levels/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // The progress context module exports both the provider component and the
    // useProgress hook — a standard React context pattern.
    files: ['src/game/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
