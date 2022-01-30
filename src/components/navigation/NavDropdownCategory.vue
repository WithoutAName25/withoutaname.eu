<script setup lang="ts">
defineProps({
    name: {
        type: String,
        required: true
    }
})
</script>

<template>
  <div class="category">
    <div class="name">{{ name }}</div>
    <slot/>
  </div>
</template>

<style scoped lang="scss">
.category {
  padding: 1rem;

  .name {
    font-size: 1.2em;
    font-weight: bold;
    padding: .5rem;
  }
}
</style>