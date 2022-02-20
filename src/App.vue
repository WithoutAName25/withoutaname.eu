<script setup lang="ts">
import { useTheme } from "~/composables"

useHead({
  title: "WithoutAName",
  meta: [{ name: "description", content: "Personal website of WithoutAName" }],
})
useTheme()
</script>

<template>
  <header></header>
  <main>
    <router-view />
  </main>
</template>

<style>
@import "styles/style.pcss";

header {
  flex: 0 0 auto;
}

main {
  padding: 1rem;
  flex: 1 1 auto;
  overflow: hidden auto;
}
</style>
