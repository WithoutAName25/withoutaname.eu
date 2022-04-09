<script setup lang="ts">
import { Icon } from "@iconify/vue"
import MainNav from "~/components/nav/MainNav.vue"
</script>

<template>
  <div :class="$style.bar">
    <router-link aria-label="Home" :class="$style.logo_link" to="/">
      <Icon :class="$style.logo" icon="mdi:home" />
    </router-link>
    <MainNav :class="$style.nav" />
  </div>
</template>

<style module>
.bar {
  display: flex;
  height: 4rem;
  align-items: center;
  justify-content: space-between;
  background: var(--surface-2);
  box-shadow: var(--shadow-2);
}
.logo_link,
.logo_link:visited {
  color: var(--text-1);
}
.logo {
  box-sizing: content-box;
  width: 2rem;
  padding-inline: 1em;
}
</style>
