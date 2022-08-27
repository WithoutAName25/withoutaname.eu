<script lang="ts">
  import { DefaultRules } from "../../../modules/games/sudoku/rules"
  import SudokuGridDisplay from "../../../modules/games/sudoku/SudokuGridDisplay.svelte"

  const rules = new DefaultRules()
  const grid = rules.getGrid()
</script>

<SudokuGridDisplay {grid} />
