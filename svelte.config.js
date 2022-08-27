import adapterNode from "@sveltejs/adapter-node"
import vercel from "@sveltejs/adapter-vercel"
import preprocess from "svelte-preprocess"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter:
      process.env.VERCEL === "true"
        ? vercel({
            edge: true,
          })
        : adapterNode(),
    prerender: {
      default: true,
    },
  },
}

export default config
