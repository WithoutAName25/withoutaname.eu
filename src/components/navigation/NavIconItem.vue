<script setup lang="ts">
import NavItem from "./NavItem.vue";

defineProps({
    href: String,
    label: String,
    icon: [Object, Array, String]
});
</script>

<template>
  <NavItem :href="href" :aria-label="label">
    <FontAwesomeIcon :icon="icon"/>
  </NavItem>
</template>

<style scoped lang="scss">

</style>