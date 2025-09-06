import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import jest from 'eslint-plugin-jest';

export default tseslint.config(  // helper to get IntelliSense in our config
  eslint.configs.recommended, // the configs imported from eslint
  ...tseslint.configs.recommended, // idem for eslint, eg tto read .ts
  {ignores: [ // source: https://github.com/eslint/eslint/discussions/18304
    "build/**",
    "src/**/*.js"]},
  { // our own config ...
    files: ['**/*.ts', '**/*.spec.ts'],  // wat te linten
    plugins: {  // extra functionaliteiten in eslint via plugins
      '@stylistic': stylistic,  // de string die in de rulesd wordt gebuikt
    },
    rules: {
      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
          maxBOF: 0,
        },
      ],
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/no-tabs': ['error'],
      '@stylistic/max-len': [
        'error',
        {
          code: 120,
          tabWidth: 2,
        },
      ],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      '@stylistic/no-inner-declarations': 'off',
      '@typescript-eslint/no-explicit-any': 'off',   // handig voor later
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',  // handig voor later
    },
  },
  {
    // files: ['**/*.spec.ts'],
    files: ['**/__tests_/**/*.spec.ts'],
    plugins: { jest },
  },
);
