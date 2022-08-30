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
    position: absolute;
    display: grid;
    grid-template-columns: repeat(var(--width), 1fr);
    grid-template-rows: repeat(var(--height), 1fr);
    border: 3px solid #ddd;
    width: 45rem;
    height: 45rem;
    transform: translateX(-50%);
    left: 50%;
    margin-top: 1rem;
  }
</style>
