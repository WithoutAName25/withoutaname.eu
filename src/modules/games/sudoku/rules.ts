import { NoDuplicatesConstraint } from "./constraints"
import { SudokuGrid } from "./grid"

export interface Rules {
  getGrid(): SudokuGrid
}

export class DefaultRules implements Rules {
  getGrid(): SudokuGrid {
    const grid = new SudokuGrid()

    for (const row of grid.rows) {
      new NoDuplicatesConstraint(grid).addFields(row)
    }

    for (const column of grid.columns) {
      new NoDuplicatesConstraint(grid).addFields(column)
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const noDuplicatesConstraint = new NoDuplicatesConstraint(grid)
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            noDuplicatesConstraint.addField(grid.columns[i * 3 + x][j * 3 + y])
          }
        }
      }
    }

    return grid
  }
}
