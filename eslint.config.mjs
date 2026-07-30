import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // These compiler-oriented rules currently flag established browser effects
      // such as document navigation and one-time hydration state.
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
    },
  },
  {
    files: ['src/admin/**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Payload Admin owns its internal navigation shell.
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    '.backups/**',
    'node_modules/**',
    'src/app/(payload)/admin/importMap.js',
    'src/payload-types.ts',
  ]),
])
