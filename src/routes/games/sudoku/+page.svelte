<script lang="ts">
  import { browser } from "$app/environment"
  import { SudokuGrid } from "../../../modules/games/sudoku/grid"
  import { DefaultRules } from "../../../modules/games/sudoku/rules"
  import SudokuGridDisplay from "../../../modules/games/sudoku/SudokuGridDisplay.svelte"

  console.time("gridCreation")
  let grid: SudokuGrid
  if (browser) {
    const rules = new DefaultRules()
    grid = rules.getGrid()
  } else {
    grid = new SudokuGrid()
  }
  console.timeEnd("gridCreation")
</script>

<SudokuGridDisplay {grid} />
