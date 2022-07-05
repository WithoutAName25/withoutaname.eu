import { writable } from "svelte/store"
import { DynamicDerived } from "../../../scripts/store"
import { isSetEqual } from "../../../scripts/utils"
import type { SudokuField } from "./field"

export interface Constraint {}

export class NoDuplicatesConstraint implements Constraint {
  private readonly fields = writable<SudokuField[]>([])

  constructor() {}

  addFields(fields: readonly SudokuField[]) {
    for (const field of fields) {
      this.addField(field)
    }
  }

  addField(fieldA: SudokuField) {
    this.fields.update(($fields) => {
      $fields.push(fieldA)
      return $fields
    })

    const excludedValues = new DynamicDerived(
      this.fields,
      ($fields) =>
        $fields
          .filter((field) => field !== fieldA)
          .map((field) => field.possibleValues),
      ($possibleValuesPerField) => {
        const valuesPerLength = new Map<number, ReadonlySet<string>[]>()
        for (const $possibleValues of $possibleValuesPerField) {
          const values = valuesPerLength.get($possibleValues.size) || []
          values.push($possibleValues)
          valuesPerLength.set($possibleValues.size, values)
        }
        const notPossibleValues = new Set<string>()
        for (const [length, values] of valuesPerLength) {
          for (let i = 0; i < values.length; i++) {
            let numberOfOccurrences = 1
            const value = values[i]
            for (let j = i + 1; j < values.length; j++) {
              if (isSetEqual(value, values[j])) numberOfOccurrences++
            }
            if (numberOfOccurrences === length) {
              for (const value of values[i]) {
                notPossibleValues.add(value)
              }
            }
          }
        }
        return notPossibleValues
      },
      isSetEqual
    )
    fieldA.excludedValuesPerConstraint.update(
      ($excludedValuesPerConstraint) => {
        $excludedValuesPerConstraint.push(excludedValues)
        return $excludedValuesPerConstraint
      }
    )
  }
}
