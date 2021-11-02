<script setup lang="ts">
defineProps({
  type: {
    default: "fas",
    type: String,
    validator(value: unknown): boolean {
      return value == "fas" || value == "fab" || value == "fa-solid" || value == "fa-brands";
    }
  },
  name: {
    type: String,
    required: true
  }
})
</script>

<template>
<i :class="[type, 'fa-' + name]"/>
</template>