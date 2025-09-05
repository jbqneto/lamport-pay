// eslint.config.mjs
import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginA11y from 'eslint-plugin-jsx-a11y';
import pluginImport from 'eslint-plugin-import';
import pluginUnused from 'eslint-plugin-unused-imports';

export default [
  // Ignorados globais (além do .eslintignore)
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'out/**', 'coverage/**'],
  },

  // Base para JS/TS
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      // parser para TS se você usa TypeScript:
      // parser: (await import('@typescript-eslint/parser')).default,
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        // Next.js no lado do servidor também usa Node:
        process: 'readonly',
      },
    },
    settings: {
      // Crucial para o plugin-import resolver módulos e apontar libs “faltando”
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        // Habilite este bloco se você usa TypeScript (tsconfig paths, etc.)
        // typescript: {
        //   alwaysTryTypes: true,
        //   project: ['./tsconfig.json'],
        // },
      },
      react: { version: 'detect' },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginA11y,
      import: pluginImport,
      'unused-imports': pluginUnused,
    },
    rules: {
      // Regras base recomendadas
      ...js.configs.recommended.rules,

      // React / Hooks / A11y
      ...pluginReact.configs.recommended.rules,
      ...pluginA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Next.js não requer React em escopo
      'react/jsx-uses-react': 'off',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Imports — pega imports quebrados (biblioteca faltando/typo)
      'import/no-unresolved': 'error',
      'import/named': 'warn',
      'import/no-duplicates': 'warn',
      'import/order': ['warn', {
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],

      // Limpeza — flags úteis no dia a dia
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',

      // Remoção automática de imports não usados (melhor que no-unused-vars)
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn', {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      }],
    },
  },

  // Regras específicas para TypeScript (descomente se usar TS)
  // {
  //   files: ['**/*.{ts,tsx}'],
  //   plugins: {
  //     '@typescript-eslint': (await import('@typescript-eslint/eslint-plugin')).default,
  //   },
  //   languageOptions: {
  //     parser: (await import('@typescript-eslint/parser')).default,
  //     parserOptions: {
  //       project: ['./tsconfig.json'],
  //       ecmaFeatures: { jsx: true },
  //     },
  //   },
  //   rules: {
  //     ...((await import('@typescript-eslint/eslint-plugin')).configs.recommended.rules),
  //     // Evita conflito com no-unused-vars do core
  //     'no-unused-vars': 'off',
  //     '@typescript-eslint/no-unused-vars': ['warn', {
  //       vars: 'all',
  //       varsIgnorePattern: '^_',
  //       args: 'after-used',
  //       argsIgnorePattern: '^_',
  //     }],
  //   },
  // },
];
