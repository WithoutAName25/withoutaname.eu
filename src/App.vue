<script setup lang="ts">
import HeaderBar from "~/components/HeaderBar.vue"
import { useTheme } from "~/composables"

useHead({
  title: "WithoutAName",
  meta: [{ name: "description", content: "Personal website of WithoutAName" }],
})

useTheme()
</script>

<template>
  <header><HeaderBar /></header>
  <main>
    <router-view />
  </main>
</template>

<style>
@import "styles/style.pcss";
#app {
  display: flex;
  flex-flow: column;
  height: 100vh;
  overflow: hidden;
}

header {
  flex: 0 0 auto;
  z-index: 100;
}

main {
  padding: 1.5rem 1rem 1rem;
  flex: 1 1 auto;
  overflow: auto;
}
</style>
