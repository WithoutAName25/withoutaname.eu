module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    project: "tsconfig.json",
    extraFileExtensions: [".svelte"] // This is a required setting in `@typescript-eslint/parser` v4.24.0.
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:svelte/recommended",
    "plugin:svelte/prettier"
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "svelte/valid-compile": "warn",
  },
  ignorePatterns: ["*.cjs", "*.js", "playwright.config.ts"],
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: {
          // Specify a parser for each lang.
          ts: "@typescript-eslint/parser",
          js: "espree",
          typescript: "@typescript-eslint/parser",
        },
      },
    },
  ],
  env: {
    browser: true,
    es2017: true,
    node: true
  }
}
