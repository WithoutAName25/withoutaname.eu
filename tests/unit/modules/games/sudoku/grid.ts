import { describe, expect, test } from "vitest"
import { SudokuField } from "../../../../../src/modules/games/sudoku/field"
import { SudokuGrid } from "../../../../../src/modules/games/sudoku/grid"

describe("Sudoku grid", () => {
  test("rows and columns arrays should have the correct length", () => {
    let width = 4
    let height = 2
    const grid = new SudokuGrid(width, height)

    let rows = grid.rows
    expect(rows.length).toBe(height)
    for (const row of rows) {
      expect(row.length).toBe(width)
    }

    let columns = grid.columns
    expect(columns.length).toBe(width)
    for (const column of columns) {
      expect(column.length).toBe(height)
    }
  })

  test("rows and columns should contain the same fields", () => {
    const grid = new SudokuGrid(4, 7)
    const rows = grid.rows
    const columns = grid.columns
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        expect(rows[i][j]).toBe(columns[j][i])
      }
    }
  })

  test("values should be instances of SudokuField", () => {
    const grid = new SudokuGrid(9, 9)
    for (const row of grid.rows) {
      for (const field of row) {
        expect(field).toBeInstanceOf(SudokuField)
      }
    }
  })

  test("diagonals should have the correct values", () => {
    const grid = new SudokuGrid(4, 3)

    function shouldHaveCorrectSize(
      diagonals: readonly (readonly SudokuField[])[]
    ) {
      expect(positiveDiagonals.length).toBe(6)
      expect(positiveDiagonals[0].length).toBe(1)
      expect(positiveDiagonals[1].length).toBe(2)
      expect(positiveDiagonals[2].length).toBe(3)
      expect(positiveDiagonals[3].length).toBe(3)
      expect(positiveDiagonals[4].length).toBe(2)
      expect(positiveDiagonals[5].length).toBe(1)
    }

    const positiveDiagonals = grid.positiveDiagonals
    shouldHaveCorrectSize(positiveDiagonals)
    expect(positiveDiagonals[0][0]).toBe(grid.columns[0][0])
    expect(positiveDiagonals[2][0]).toBe(grid.columns[0][2])
    expect(positiveDiagonals[3][2]).toBe(grid.columns[3][0])
    expect(positiveDiagonals[5][0]).toBe(grid.columns[3][2])

    const negativeDiagonals = grid.negativeDiagonals
    shouldHaveCorrectSize(negativeDiagonals)
    expect(negativeDiagonals[0][0]).toBe(grid.columns[0][2])
    expect(negativeDiagonals[2][0]).toBe(grid.columns[0][0])
    expect(negativeDiagonals[3][2]).toBe(grid.columns[3][2])
    expect(negativeDiagonals[5][0]).toBe(grid.columns[3][0])
  })

  test("default diagonals should be undefined if the grid is not square", () => {
    const grid = new SudokuGrid(4, 3)
    expect(grid.positiveDiagonal).toBeUndefined()
    expect(grid.negativeDiagonal).toBeUndefined()
  })

  test("default diagonals should be defined if the grid is square", () => {
    const grid = new SudokuGrid(4, 4)
    expect(grid.positiveDiagonal).toBeDefined()
    expect(grid.positiveDiagonal).toBe(grid.positiveDiagonals[3])
    expect(grid.negativeDiagonal).toBeDefined()
    expect(grid.negativeDiagonal).toBe(grid.negativeDiagonals[3])
  })
})
