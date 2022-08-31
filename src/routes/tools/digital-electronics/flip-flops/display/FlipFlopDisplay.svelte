<script lang="ts">
  import type { FlipFlop } from "../flip-flop"
  import FlipFlopPinsOfPosDisplay from "./FlipFlopPinsOfPosDisplay.svelte"

  export let flipFlop: FlipFlop

  const { dualControlled, edgeControlled } = flipFlop.settings

  const x = 25
  const y = 25
  const width = 50
  const height = 50
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class="svg"
  viewBox="0 0 100 100"
  fill="none"
  data-color-stroke=""
  font-family="system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif"
  font-size="10"
  aria-label="Flip-flop display"
>
  {#each [...flipFlop.pins] as [pos, pins]}
    <FlipFlopPinsOfPosDisplay
      {pins}
      {pos}
      {x}
      {y}
      {width}
      {height}
      dualControlled={$dualControlled}
      edgeControlled={$edgeControlled}
    />
  {/each}
  <rect {x} {y} {width} {height} />
</svg>

<style lang="scss">
  .svg * {
    fill: transparent;
    stroke: var(--text-2);
  }
</style>
