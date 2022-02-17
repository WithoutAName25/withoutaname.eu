<script setup lang="ts">
import { TimingData } from "../../script/tools/digital-electronics/timingdiagram";

defineProps({
    data: {
        type: TimingData,
        required: true
    }
})
</script>

<template>
  <svg :viewBox="`-10 -5 ${10 + data.size * 10} ${10 + data.timingData.length * 10}`" width="300px">
    <g v-for="(singleTimingData, i) in data.timingData">
      <text x="-10" :y="10 * (i + 1)" font-size="10">{{ singleTimingData.name }}</text>
      <polyline :points="singleTimingData.getPolylinePoints(0, 10 * i + 2, 10, 6)"></polyline>
    </g>
  </svg>
</template>

<style scoped lang="scss">
svg {
  fill: var(--color-text);
}

polyline {
  fill: none;
  stroke: var(--color-text);
}
</style>