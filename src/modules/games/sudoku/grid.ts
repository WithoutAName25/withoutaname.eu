import { SudokuField } from "./field"

export const DEFAULT_ALLOWED_VALUES: ReadonlySet<string> = new Set([
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
])

export class SudokuGrid {
  rows: readonly (readonly SudokuField[])[]
  columns: readonly (readonly SudokuField[])[]
  positiveDiagonal: readonly SudokuField[] | undefined
  positiveDiagonals: readonly (readonly SudokuField[])[]
  negativeDiagonal: readonly SudokuField[] | undefined
  negativeDiagonals: readonly (readonly SudokuField[])[]

  constructor(
    readonly width = 9,
    readonly height = 9,
    readonly allowedValues = DEFAULT_ALLOWED_VALUES
  ) {
    const rows: SudokuField[][] = Array.from({ length: height }, () => [])
    const columns: SudokuField[][] = Array.from({ length: width }, () => [])
    const positiveDiagonals: SudokuField[][] = []
    const negativeDiagonals: SudokuField[][] = []

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const field = new SudokuField(allowedValues)
        rows[y][x] = field
        columns[x][y] = field
      }
    }

    for (let i = 0; i < width + height - 1; i++) {
      const length = Math.min(i + 1, width, height, width + height - 1 - i)
      positiveDiagonals.push(new Array(length))
      negativeDiagonals.push(new Array(length))

      for (let j = 0; j < length; j++) {
        const x = Math.max(0, i - (height - 1)) + j
        positiveDiagonals[i][j] = columns[x][Math.min(i, height - 1) - j]
        negativeDiagonals[i][j] = columns[x][Math.max(0, height - 1 - i) + j]
      }
    }

    this.rows = rows
    this.columns = columns
    this.positiveDiagonals = positiveDiagonals
    this.negativeDiagonals = negativeDiagonals

    if (width === height) {
      this.positiveDiagonal = positiveDiagonals[width - 1]
      this.negativeDiagonal = negativeDiagonals[width - 1]
    }
  }
}
