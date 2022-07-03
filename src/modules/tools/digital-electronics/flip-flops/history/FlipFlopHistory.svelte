<script lang="ts">
  import type {
    FlipFlopHistoryData,
    PinHistoryData,
  } from "./flip-flop-history-data"
  import FlipFlopPinHistory from "./FlipFlopPinHistory.svelte"

  export let history: FlipFlopHistoryData

  const pinHistories = history.pinHistories

  const { length, showQMaster, showQNot } = history.settings

  $: intervalWidth = 80 / $length

  $: count = $pinHistories.length - ($showQMaster ? 0 : 1) - ($showQNot ? 0 : 1)

  $: rowHeight = 70 / count

  $: visiblePinHistories = $pinHistories.filter(
    (value: PinHistoryData) =>
      ($showQMaster || value.name !== "Qm") &&
      ($showQNot || value.name !== "Q'")
  )
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class="svg"
  viewBox="-15 -5 100 80"
  fill="none"
  data-color-stroke=""
  font-family="system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif"
  font-size="10"
  aria-label="Flip-flop timing diagram"
>
  <defs>
    <pattern
      id="grid"
      x="0"
      y="0"
      width={intervalWidth}
      height={rowHeight}
      patternUnits="userSpaceOnUse"
    >
      <polygon
        class="grid"
        points={`0,0 0,${rowHeight} ${intervalWidth},${rowHeight} ${intervalWidth},0`}
        fill="none"
        data-color-stroke-low-contrast=""
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
  {#each visiblePinHistories as pinHistoryData, i}
    <FlipFlopPinHistory
      x={0}
      y={rowHeight * (i + 0.5)}
      width={80}
      height={rowHeight * 0.5}
      {pinHistoryData}
    />
  {/each}
</svg>

<style lang="scss">
  .svg {
    :global(text) {
      fill: var(--text-2);
    }
    :global(polyline) {
      stroke: var(--text-2);
    }
  }
  .grid {
    stroke: var(--low-contrast);
  }
</style>
