<script setup lang="ts">
import { ref, watch } from "vue";
import TimingDiagram from "../../../components/tools/TimingDiagram.vue";
import { SingleTimingData, TimingData } from "../../../script/tools/digital-electronics/timingdiagram";

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

let timingSize = 10
let timingData = new TimingData(Array.of(
        new SingleTimingData("S", Array(timingSize).fill(isS.value)),
        new SingleTimingData("R", Array(timingSize).fill(isR.value)),
        new SingleTimingData("Q", Array(timingSize).fill(isQ.value)),
        new SingleTimingData("Q*", Array(timingSize).fill(isNotQ.value)),
), timingSize)
watch([isS, isR, isQ, isNotQ], value => {
    timingData.push(value)
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
  <svg class="circuit" width="100" height="100">
    <rect x="25" y="10" width="50" height="80"/>
    <line x1="10" y1="25" x2="25" y2="25" :class="{ high: isS }"/>
    <line x1="10" y1="75" x2="25" y2="75" :class="{ high: isR }"/>
    <line x1="75" y1="25" x2="90" y2="25" :class="{ high: isQ }"/>
    <line x1="75" y1="75" x2="90" y2="75" :class="{ high: isNotQ }"/>
  </svg>
  <TimingDiagram :data="timingData"/>
</template>

<style scoped lang="scss">
.circuit {
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