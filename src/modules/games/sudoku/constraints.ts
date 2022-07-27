import { derived, get, writable } from "svelte/store"
import { DynamicDerived } from "../../../scripts/store"
import { applyToAllCombinations, isSetEqual } from "../../../scripts/utils"
import type { SudokuField } from "./field"
import { ForcedValue } from "./field"
import { DEFAULT_ALLOWED_VALUES } from "./grid"

export class NoDuplicatesConstraint {
  private readonly fields = writable<SudokuField[]>([])

  constructor(readonly allowedValues = DEFAULT_ALLOWED_VALUES) {
    let registeredForcedValues = false
    this.fields.subscribe(($fields) => {
      if (registeredForcedValues) throw new Error("Should not change anymore")

      if ($fields.length === this.allowedValues.size) {
        for (const allowedValue of allowedValues) {
          const store = derived(
            $fields.map((value) => value.possibleValues),
            ($possibleValuesPerField) =>
              new ForcedValue(
                allowedValue,
                $possibleValuesPerField
                  .map((value, index) =>
                    value.has(allowedValue) ? $fields[index] : undefined
                  )
                  .filter((value) => value !== undefined) as SudokuField[]
              )
          )
          for (const field of $fields) {
            field.forcedValues.update(($forcedValues) => {
              $forcedValues.push(store)
              return $forcedValues
            })
            for (const otherField of $fields) {
              if (otherField === field) continue

              const excludedValues = new DynamicDerived(
                otherField.forcedValues,
                ($forcedValues) => $forcedValues,
                ($forcedValues) => {
                  const excludedValues = new Set<string>()
                  for (const forcedValue of $forcedValues) {
                    if (
                      forcedValue.possibleFields.every(
                        (value) =>
                          value !== field && $fields.indexOf(value) !== -1
                      )
                    ) {
                      excludedValues.add(forcedValue.value)
                    }
                  }
                  return excludedValues
                }
              )

              field.excludedValuesPerConstraint.update(
                ($excludedValuesPerConstraint) => {
                  $excludedValuesPerConstraint.push(excludedValues)
                  return $excludedValuesPerConstraint
                }
              )
            }
          }
        }

        registeredForcedValues = true
      }
    })
  }

  addFields(fields: readonly SudokuField[]) {
    for (const field of fields) {
      this.addField(field)
    }
  }

  addField(field: SudokuField) {
    if (get(this.fields).length >= this.allowedValues.size)
      throw new Error("Too many fields")

    this.fields.update(($fields) => {
      $fields.push(field)
      return $fields
    })

    const excludedValues = new DynamicDerived(
      this.fields,
      ($fields) =>
        $fields
          .filter((value) => value !== field)
          .map((value) => value.possibleValues),
      ($possibleValuesPerField) => {
        const excludedValues = new Set<string>()

        for (let k = 1; k <= $possibleValuesPerField.length; k++) {
          const array = $possibleValuesPerField.filter(
            (value) => value.size <= k
          )

          if (array.length < k) continue

          applyToAllCombinations(array, k, (selected) => {
            const values = new Set<string>()
            for (const set of selected) {
              for (const value of set) {
                values.add(value)
              }
            }
            if (values.size === k) {
              for (const value of values) {
                excludedValues.add(value)
              }
            }
          })
        }

        return excludedValues
      },
      isSetEqual
    )
    field.excludedValuesPerConstraint.update(($excludedValuesPerConstraint) => {
      $excludedValuesPerConstraint.push(excludedValues)
      return $excludedValuesPerConstraint
    })
  }
}
