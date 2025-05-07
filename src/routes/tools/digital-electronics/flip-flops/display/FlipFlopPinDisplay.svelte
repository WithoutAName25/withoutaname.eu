<script lang="ts">
  import type { Writable } from "svelte/store"
  import type { FlipFlopPin, Pos } from "../flip-flop-pins"

  export let pin: FlipFlopPin
  export let value: Writable<boolean>
  export let pos: Pos
  export let x: number
  export let y: number
  export let dualControlled: boolean
  export let edgeControlled: boolean

  $: edgeControlSymbol = edgeControlled && pin.name === "C"
  $: masterSlaveSymbol = dualControlled && pin.name[0] === "Q"

  // TODO: find a better way to do this
  // eslint-disable-next-line svelte/no-reactive-functions
  $: getX = (offsetX: number, offsetY: number) => {
    switch (pos) {
      case "left":
        return x - offsetX
      case "right":
        return x + offsetX
      case "top":
        return x + offsetY
      case "bottom":
        return x - offsetY
    }
  }
  // TODO: find a better way to do this
  // eslint-disable-next-line svelte/no-reactive-functions
  $: getY = (offsetX: number, offsetY: number) => {
    switch (pos) {
      case "left":
        return y - offsetY
      case "right":
        return y + offsetY
      case "top":
        return y - offsetX
      case "bottom":
        return y + offsetX
    }
  }
</script>

<g>
  <line
    x1={getX(pin.name.endsWith("'") ? 5 : 0, 0)}
    y1={getY(pin.name.endsWith("'") ? 5 : 0, 0)}
    x2={getX(10, 0)}
    y2={getY(10, 0)}
    stroke={$value ? "red" : undefined}
    class:active={$value}
  />
  {#if pin.name.endsWith("'")}
    <circle
      r="2"
      cx={getX(3, 0)}
      cy={getY(3, 0)}
      stroke={$value ? "red" : undefined}
      class:active={$value}
    />
  {/if}
  {#if edgeControlSymbol}
    <polyline
      points={`${getX(0, -2.5)},${getY(0, -2.5)} ${getX(-5, 0)},${getY(
        -5,
        0
      )} ${getX(0, 2.5)},${getY(0, 2.5)} `}
    />
  {/if}
  {#if masterSlaveSymbol}
    <polyline
      points={`${getX(-6, -2)},${getY(-6, -2)} ${getX(-2, -2)},${getY(
        -2,
        -2
      )} ${getX(-2, 2)},${getY(-2, 2)} `}
    />
  {/if}
  <g data-color-fill="" stroke="none">
    <text
      x={getX(edgeControlSymbol || masterSlaveSymbol ? -11 : -6, 0) - 1}
      y={getY(edgeControlSymbol || masterSlaveSymbol ? -11 : -6, 0) + 1}
      text-anchor="middle"
      dominant-baseline="middle"
    >
      {pin.name}
    </text>
    <text
      x={getX(15, 0)}
      y={getY(15, 0) + 0.5}
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="7.5"
      fill={$value ? "red" : undefined}
      class:active={$value}
    >
      {$value ? "1" : "0"}
    </text>
  </g>
  <rect
    on:click={() => (pin.isInput ? ($value = !$value) : undefined)}
    x={getX(15, 0) - 5}
    y={getY(15, 0) - 5}
    width="10"
    height="10"
    stroke={$value ? "red" : undefined}
    class:active={$value}
    class:clickable={pin.isInput}
  />
</g>

<style lang="scss">
  * {
    fill: transparent;
    stroke: var(--text-2);

    &.active {
      stroke: red;
    }
  }
  .clickable {
    cursor: pointer;
  }
  text {
    fill: var(--text-2);
    stroke: none;
    &.active {
      stroke: none;
      fill: red;
    }
  }
</style>
