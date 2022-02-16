<script setup lang="ts">
import { ref, watch } from "vue";

const isS = ref(false)
const isR = ref(false)
const isQ = ref(false)
const isNotQ = ref(true)
watch([isS, isR], () => {
    if (isS.value && isR.value) {
        isQ.value = false
        isNotQ.value = false
    } else if (isS.value) {
        isQ.value = true
        isNotQ.value = false
    } else if (isR.value) {
        isQ.value = false
        isNotQ.value = true
    }
})
</script>

<template>
  <label>
    <input type="checkbox" v-model="isS">
    S
  </label>
  <label>
    <input type="checkbox" v-model="isR">
    R
  </label>
  <svg width="100" height="100">
    <rect x="25" y="10" width="50" height="80"/>
    <line x1="10" y1="25" x2="25" y2="25" :class="{ high: isS }"/>
    <line x1="10" y1="75" x2="25" y2="75" :class="{ high: isR }"/>
    <line x1="75" y1="25" x2="90" y2="25" :class="{ high: isQ }"/>
    <line x1="75" y1="75" x2="90" y2="75" :class="{ high: isNotQ }"/>
  </svg>
</template>

<style scoped lang="scss">
svg {
  stroke: var(--color-text);
  stroke-width: 2;
}

rect {
  fill: none;
}

.high {
  stroke: red;
}
</style>