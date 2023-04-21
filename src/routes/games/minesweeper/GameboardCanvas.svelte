<script lang="ts">
  import { onMount } from "svelte"
  import { GameBoard } from "./gameboard"

  let canvasElement
  let textureAtlas

  onMount(() => {
    const ctx: CanvasRenderingContext2D = canvasElement.getContext("2d")
    const gameboard = new GameBoard(10, 10, 10)
    for (let row of gameboard.cells) {
      for (let cell of row) {
        cell.draw(ctx, textureAtlas)
      }
    }
  })
</script>

<canvas width="160" height="160" bind:this={canvasElement} />
<div class="display-none">
  <img
    src="/images/minesweeper_texture_atlas.png"
    alt="texture atlas"
    bind:this={textureAtlas}
  />
</div>
