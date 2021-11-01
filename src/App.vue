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
