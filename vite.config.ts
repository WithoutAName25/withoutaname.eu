import { sveltekit } from "@sveltejs/kit/vite"
import autoprefixer from "autoprefixer"
import open_props from "open-props"
// @ts-ignore
import postcss_jit_props from "postcss-jit-props"
import postcssPresetEnv from "postcss-preset-env"
import Icons from "unplugin-icons/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      autoInstall: true,
      compiler: "svelte",
      defaultStyle: "vertical-align: -0.125em;",
      defaultClass: "icon",
      scale: 1,
    }),
  ],
  ssr: {
    noExternal: ["open-props"],
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        postcssPresetEnv({
          stage: 1,
        }),
        postcss_jit_props(open_props),
      ],
    },
  },
  test: {
    coverage: {
      all: true,
      reporter: ["json", "text", "text-summary"],
    },
    include: ["tests/unit/**/*.ts"],
  },
})
