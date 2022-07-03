import adapter from "@sveltejs/adapter-vercel"
import autoprefixer from "autoprefixer"
import OpenProps from "open-props"
import postcssJitProps from "postcss-jit-props"
import postcssPresetEnv from "postcss-preset-env"
import preprocess from "svelte-preprocess"
import Icons from "unplugin-icons/vite"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    prerender: {
      default: true,
    },
    vite: {
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
            postcssJitProps(OpenProps),
          ],
        },
      },
      plugins: [
        Icons({
          autoInstall: true,
          compiler: "svelte",
          defaultStyle: "vertical-align: -0.125em;",
          defaultClass: "icon",
          scale: 1,
        }),
      ],
      test: {
        coverage: {
          all: true,
          src: ["src"],
          reporter: ["json", "text", "text-summary"],
        },
        include: ["tests/unit/**/*.ts"],
      },
    },
  },
}

export default config
