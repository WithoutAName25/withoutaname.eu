import autoprefixer from "autoprefixer"
import path from "path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Pages from "vite-plugin-pages"
import Components from "unplugin-vue-components/vite"
import AutoImport from "unplugin-auto-import/vite"
import Markdown from "vite-plugin-md"
import LinkAttributes from "markdown-it-link-attributes"
import legacy from "@vitejs/plugin-legacy"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        require("postcss-preset-env")({
          stage: 1,
        }),
        require("postcss-jit-props")(require("open-props")),
      ],
    },
  },
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    legacy(),
    Pages({
      extensions: ["vue", "md"],
    }),
    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/head", "@vueuse/core"],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue", "md"],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/components.d.ts",
    }),
    Markdown({
      headEnabled: true,
      markdownItSetup(md) {
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener",
          },
        })
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "WithoutAName.net",
        short_name: "WithoutAName",
        theme_color: "#ffffff",
      },
    }),
  ],
  ssgOptions: {
    dirStyle: "nested",
    formatting: "minify",
    script: undefined,
    includedRoutes: (paths, routes) => {
      paths = paths.filter((path) => !path.includes(":") && !path.includes("*"))
      paths.push("/not-found")
      return paths
    },
  },
  optimizeDeps: {
    include: ["vue", "vue-router", "@vueuse/core", "@vueuse/head"],
    exclude: ["vue-demi"],
  },
  test: {
    include: ["test/**/*.test.ts"],
    environment: "jsdom",
    deps: {
      inline: ["@vue", "@vueuse"],
    },
  },
})
