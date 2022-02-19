import { ViteSSG } from "vite-ssg"
import routes from "pages-generated"
import App from "./App.vue"

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(App, { routes }, (ctx) => {
  Object.values(import.meta.globEager("./modules/*.ts")).forEach((i) =>
    i.install?.(ctx)
  )
})
