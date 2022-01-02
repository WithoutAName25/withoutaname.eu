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
  <a :href="href" v-if="external">
    <slot/>
  </a>
  <router-link :to="href" v-else>
    <slot/>
  </router-link>
</template>