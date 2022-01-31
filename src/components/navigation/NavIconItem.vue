<script setup lang="ts">
import NavItem from "./NavItem.vue";

defineProps({
    external: {
        default: false,
        type: Boolean
    },
    href: String,
    label: String,
    icon: [Object, Array, String]
});
</script>

<template>
  <NavItem :href="href" :external="external" :aria-label="label">
    <FontAwesomeIcon :icon="icon"/>
  </NavItem>
</template>

<style scoped lang="scss">

</style>