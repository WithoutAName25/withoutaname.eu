import { get } from "svelte/store"
import { describe, expect, test } from "vitest"
import { NoDuplicatesConstraint } from "../../../../../src/modules/games/sudoku/constraints"
import { SudokuField } from "../../../../../src/modules/games/sudoku/field"

describe("Sudoku constraints", () => {
  describe("No duplicates constraints", () => {
    test("should only allow other values if one value is set", () => {
      const allowedValues = new Set(["1", "2", "3"])

      const fieldA = new SudokuField(allowedValues)
      const fieldB = new SudokuField(allowedValues)
      const fieldC = new SudokuField(allowedValues)

      const constraint = new NoDuplicatesConstraint()
      constraint.addField(fieldA)
      constraint.addField(fieldB)
      constraint.addField(fieldC)

      expect(get(fieldA.possibleValues)).toEqual(new Set(["1", "2", "3"]))
      expect(get(fieldB.possibleValues)).toEqual(new Set(["1", "2", "3"]))
      expect(get(fieldC.possibleValues)).toEqual(new Set(["1", "2", "3"]))

      fieldA.value.set("1")

      expect(get(fieldA.possibleValues)).toEqual(new Set(["1"]))
      expect(get(fieldB.possibleValues)).toEqual(new Set(["2", "3"]))
      expect(get(fieldC.possibleValues)).toEqual(new Set(["2", "3"]))
    })
  })
})
