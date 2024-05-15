// @ts-check

import eslint from "@eslint/js"
import eslintPluginSvelte from "eslint-plugin-svelte"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // eslintPluginPrettierRecommended,
  ...eslintPluginSvelte.configs["flat/recommended"],
  // ...eslintPluginSvelte.configs["flat/prettier"],
  {
    ignores: [".*", "node_modules", "build", "coverage", "pnpm-lock.yaml"],
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: "tsconfig.json",
        extraFileExtensions: [".svelte"],
        parser: tseslint.parser,
      },
    },
    rules: {
      "svelte/valid-compile": "warn",
    },
  },
  {
    files: ["static/sw.js"],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    files: ["svelte.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
)
