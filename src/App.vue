<script setup lang="ts">
import Navigation from './components/navigation/Navigation.vue'
</script>

<template>
  <header>
    <Navigation/>
  </header>
  <main>
    <router-view/>
  </main>
</template>

<script lang="ts">
export default {
  watch: {
    '$route' (to: any) {
      document.title = to.meta.title ? to.meta.title + " - WithoutAName" : "WithoutAName"
    }
  }
}
</script>

<style lang="scss">
@use "assets/themes";

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  overflow-x: hidden;
}

main {
  margin: 10px;
}
</style>
