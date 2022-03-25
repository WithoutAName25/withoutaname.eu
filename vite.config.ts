import vueI18n from "@intlify/vite-plugin-vue-i18n"
import legacy from "@vitejs/plugin-legacy"
import Vue from "@vitejs/plugin-vue"
import autoprefixer from "autoprefixer"
import LinkAttributes from "markdown-it-link-attributes"
import path from "path"
import AutoImport from "unplugin-auto-import/vite"
import { defineConfig } from "vite"
import Markdown from "vite-plugin-md"
import Pages from "vite-plugin-pages"
import generateSitemap from "vite-ssg-sitemap"
import istanbul from "vite-plugin-istanbul"

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
    istanbul({
      requireEnv: true,
      include: "src/*",
    }),
    Pages({
      extensions: ["vue", "md"],
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/head",
        "@vueuse/core",
      ],
      dts: "src/auto-imports.d.ts",
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
    // VitePWA({
    //   registerType: "autoUpdate",
    //   manifest: {
    //     name: "WithoutAName",
    //   },
    //   workbox: {
    //     globIgnores: ["/maven**"],
    //     navigateFallbackDenylist: [/^\/maven/],
    //   },
    // }),

    vueI18n({
      runtimeOnly: true,
      include: [path.resolve(__dirname, "locales/**")],
    }),
  ],
  ssgOptions: {
    dirStyle: "nested",
    formatting: "minify",
    script: undefined,
    includedRoutes: (paths) => {
      paths = paths.filter((path) => !path.includes(":") && !path.includes("*"))
      paths.push("/not-found")
      return paths
    },
    onFinished() {
      generateSitemap({
        hostname: "https://withoutaname.eu",
      })
    },
  },
  optimizeDeps: {
    include: ["vue", "vue-router", "@vueuse/core", "@vueuse/head"],
    exclude: ["vue-demi"],
  },
  build: {
    sourcemap: true,
  },
  test: {
    coverage: {
      all: true,
      include: ["src"],
      reporter: ["text", "json"],
      clean: true,
    },
    include: ["test/**/*.test.ts"],
    environment: "jsdom",
    deps: {
      inline: ["@vue", "@vueuse"],
    },
  },
})
