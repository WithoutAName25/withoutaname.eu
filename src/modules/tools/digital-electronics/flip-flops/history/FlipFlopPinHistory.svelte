<script lang="ts">
  import type { PinHistoryData } from "./flip-flop-history-data"

  export let x: number
  export let y: number
  export let width: number
  export let height: number
  export let pinHistoryData: PinHistoryData

  $: polyPoints = pinHistoryData.getPolyPoints(x, y, width, height)
</script>

<g>
  <text
    x={x - 7.5}
    {y}
    dominant-baseline="middle"
    text-anchor="middle"
    data-color-fill=""
    font-size="9"
  >
    {pinHistoryData.name}
  </text>
  <polyline points={$polyPoints} data-color-stroke="" fill="none" />
</g>
