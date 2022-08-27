<script lang="ts">
  import type { SudokuGrid } from "./grid"
  import SudokuFieldDisplay from "./SudokuFieldDisplay.svelte"

  export let grid: SudokuGrid
</script>

<div
  class="wrapper"
  style="--width: {grid.columns.length}; --height: {grid.rows.length}"
>
  {#each grid.rows as row}
    {#each row as field}
      <SudokuFieldDisplay {field} />
    {/each}
  {/each}
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(var(--width), 1fr);
    grid-template-rows: repeat(var(--height), 1fr);
    place-items: center;
    grid-gap: 1px;
    border: 1px solid var(--low-contrast);
  }
</style>
