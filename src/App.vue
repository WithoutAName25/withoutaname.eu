<script setup lang="ts">
import Navigation from './components/Navigation.vue'
</script>

<template>
  <Navigation />
  <router-view />
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
</style>
