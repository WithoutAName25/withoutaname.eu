// @ts-check

import eslint from "@eslint/js"
import eslintPluginSvelte from "eslint-plugin-svelte"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"

export default defineConfig(
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
      "svelte/no-navigation-without-resolve": "warn",
    },
  },
  {
    // eslint-plugin-svelte@3.23.1 crashes on ESLint 10 when this rule reports
    // (uses the removed sourceCode.isSpaceBetweenTokens), even for disabled lines
    files: [
      "src/routes/tools/digital-electronics/flip-flops/display/FlipFlopPin{,sOfPos}Display.svelte",
    ],
    rules: {
      "svelte/no-reactive-functions": "off",
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
