<script setup lang="ts">
defineProps({
    external: {
        default: false,
        type: Boolean
    },
    href: String
})
</script>

<template>
  <a :href="href" v-if="external || !href">
    <slot/>
  </a>
  <router-link :to="href" v-else>
    <slot/>
  </router-link>
</template>

<style scoped lang="scss">
@use "src/assets/mixins";
@use "src/assets/navigation";

a {
  display: block;
  color: var(--color-text);
  padding: 10px 12px;
  text-decoration: none;
  font-size: 17px;
  border: none;
  border-radius: 3px;
  transition: background-color .5s;
  @include navigation.navbar {
    &.router-link-active {
      background-color: var(--color-bg-4);
    }

    @include mixins.hover {
      background-color: var(--color-bg-3);
    }
  }
}
</style>