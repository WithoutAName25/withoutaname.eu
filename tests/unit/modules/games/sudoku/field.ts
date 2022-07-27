import { get, readable } from "svelte/store"
import { describe, expect, test } from "vitest"
import { SudokuField } from "../../../../../src/modules/games/sudoku/field"

describe("Sudoku field", () => {
  const allowedValues = new Set(["1", "2", "3", "4"])
  test("All values should be possible without constraints", () => {
    const field = new SudokuField(allowedValues)
    expect(get(field.possibleValues)).toEqual(allowedValues)
  })

  test("Only values that match with all constraints should be possible", () => {
    const field = new SudokuField(allowedValues)

    field.excludedValuesPerConstraint.update((value) => {
      value.push(readable(new Set(["3", "4"])))
      return value
    })
    expect(get(field.possibleValues)).toEqual(new Set(["1", "2"]))

    field.excludedValuesPerConstraint.update((value) => {
      value.push(readable(new Set(["1", "3"])))
      return value
    })
    expect(get(field.possibleValues)).toEqual(new Set(["2"]))
  })

  test("Only current value should be possible if set", () => {
    const field = new SudokuField(allowedValues)
    expect(get(field.possibleValues)).toEqual(allowedValues)
    field.value.set("2")
    expect(get(field.possibleValues)).toEqual(new Set(["2"]))
  })
})
