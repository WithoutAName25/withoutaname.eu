<script lang="ts">
  import type { Readable } from "svelte/store"
  import type { FlipFlopPin, Pos } from "../flip-flop-pins"
  import FlipFlopPinDisplay from "./FlipFlopPinDisplay.svelte"

  export let pins: Readable<FlipFlopPin[]>
  export let pos: Pos
  export let x: number
  export let y: number
  export let width: number
  export let height: number
  export let dualControlled: boolean
  export let edgeControlled: boolean

  $: posX = (i: number) => {
    switch (pos) {
      case "left":
        return x
      case "right":
        return x + width
      case "top":
      case "bottom":
        return x + width * ((i + 1) / ($pins.length + 1))
    }
  }
  $: posY = (i: number) => {
    switch (pos) {
      case "left":
      case "right":
        return y + height * ((i + 1) / ($pins.length + 1))
      case "top":
        return y
      case "bottom":
        return y + height
    }
  }
</script>

<g>
  {#each $pins as pin, i (i)}
    <FlipFlopPinDisplay
      {pin}
      value={pin.value}
      {pos}
      x={posX(i)}
      y={posY(i)}
      {dualControlled}
      {edgeControlled}
    />
  {/each}
</g>
