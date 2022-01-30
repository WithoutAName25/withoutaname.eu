<script setup lang="ts">
import Navigation from './components/navigation/Navigation.vue';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const toggleTheme = () => {
    document.body.classList.toggle(prefersDark.matches ? "theme-light" : "theme-dark");
}
</script>

<template>
  <header>
    <Navigation @toggleTheme="toggleTheme()"/>
  </header>
  <main>
    <router-view/>
  </main>
</template>

<script lang="ts">
export default {
    watch: {
        '$route'(to: any) {
            document.title = to.meta.title ? to.meta.title + " - WithoutAName" : "WithoutAName"
        }
    }
}
</script>

<style lang="scss">
@use "assets/themes";

html, body {
  margin: 0;
  height: 100%;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

#app {
  display: flex;
  flex-flow: column;
  height: 100vh;
  overflow: hidden;
}

header {
  flex: 0 0 auto;
}

main {
  padding: 1rem;
  flex: 1 1 auto;
  overflow: hidden auto;
}

@media screen and (orientation: landscape) {
  .only-portrait {
    display: none;
  }
}

@media screen and (orientation: portrait) {
  .only-landscape {
    display: none;
  }
}
</style>
