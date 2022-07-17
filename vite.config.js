import { sveltekit } from "@sveltejs/kit/vite"
import autoprefixer from "autoprefixer"
import open_props from "open-props"
import postcss_jit_props from "postcss-jit-props"
import postcssPresetEnv from "postcss-preset-env"
import Icons from "unplugin-icons/vite"

/** @type {import('vite').UserConfig} */
const config = {
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
}

export default config
