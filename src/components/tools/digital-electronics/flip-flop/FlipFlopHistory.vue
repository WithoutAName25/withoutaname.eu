<script setup lang="ts">
import { FlipFlopHistory } from "~/scripts/tools/digital-electronics/flip-flop-history"

const props = defineProps({
  history: {
    required: true,
    type: FlipFlopHistory,
  },
})

const intervalWidth = computed(() => {
  return 80 / props.history.settings.historyLength
})

const count = computed(
  () =>
    props.history.pinHistories.length -
    (props.history.settings.showQMaster ? 0 : 1) -
    (props.history.settings.showQNot ? 0 : 1)
)

const rowHeight = computed(() => 70 / count.value)

const visiblePinHistories = () =>
  props.history.pinHistories.filter(
    (value) =>
      (props.history.settings.showQMaster || value.name !== "Qm") &&
      (props.history.settings.showQNot || value.name !== "Q'")
  )
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="$style.svg"
    viewBox="-15 -5 100 80"
    fill="none"
    stroke="black"
    font-family="system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif"
    font-size="10"
    aria-label="Flip-flop timing diagram"
  >
    <defs>
      <pattern
        id="grid"
        x="0"
        y="0"
        :width="intervalWidth"
        :height="rowHeight"
        patternUnits="userSpaceOnUse"
      >
        <polygon
          :class="$style.grid"
          :points="`0,0 0,${rowHeight} ${intervalWidth},${rowHeight} ${intervalWidth},0`"
          fill="none"
          stroke="#bbb"
          stroke-width="0.5"
        />
      </pattern>
    </defs>
    <rect
      x="-0.25"
      y="-0.25"
      width="80.5"
      height="70.5"
      fill="url(#grid)"
      stroke="none"
    />
    <g v-for="(pinHistory, i) in visiblePinHistories()">
      <text
        x="-7.5"
        :y="rowHeight * (i + 0.5)"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="black"
        font-size="9"
      >
        {{ pinHistory.name }}
      </text>
      <polyline
        :points="
          pinHistory.getPolyPoints(
            0,
            rowHeight * (i + 0.5),
            80,
            rowHeight * 0.5
          )
        "
        stroke="black"
        fill="none"
      />
    </g>
  </svg>
</template>

<style module>
.svg {
  & text {
    fill: var(--text-2);
  }
  & polyline {
    stroke: var(--text-2);
  }
}
.grid {
  stroke: var(--low-contrast);
}
</style>
