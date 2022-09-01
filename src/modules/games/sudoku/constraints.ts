import type { Readable } from "svelte/store"
import { derived, get, writable } from "svelte/store"
import { DerivedSetStore, DynamicDerivedSetStore } from "../../../scripts/store"
import { applyToAllCombinations } from "../../../scripts/utils"
import type { SudokuField } from "./field"
import { ForcedValue } from "./field"
import type { SudokuGrid } from "./grid"
import { DEFAULT_ALLOWED_VALUES } from "./grid"

export class NoDuplicatesConstraint {
  private readonly fields = writable<SudokuField[]>([])

  constructor(
    readonly grid: SudokuGrid,
    readonly allowedValues = DEFAULT_ALLOWED_VALUES
  ) {
    let registeredForcedValues = false
    this.fields.subscribe(($fields) => {
      if (registeredForcedValues) throw new Error("Should not change anymore")

      if ($fields.length === this.allowedValues.size) {
        for (const allowedValue of allowedValues) {
          const forcedValue = derived(
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
          grid.forcedValues.add(forcedValue)
        }
        for (const field of $fields) {
          const unsubscribers = new Map<Readable<ForcedValue>, () => void>()
          grid.forcedValues.onAdd((values) => {
            for (const value of values) {
              const store = new DerivedSetStore(value, ($forcedValue) => {
                const excludedValues = new Set<string>()
                if (
                  $forcedValue.possibleFields.every(
                    (value: SudokuField) =>
                      value !== field && $fields.indexOf(value) !== -1
                  )
                ) {
                  excludedValues.add($forcedValue.value)
                }
                return excludedValues
              })
              field.excludedValues.add(store)
              unsubscribers.set(value, () => {
                field.excludedValues.delete(store)
              })
            }
          })
          grid.forcedValues.onDelete((values) => {
            for (const value of values) unsubscribers.get(value)?.()
          })
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

    // TODO optimize
    const excludedValues = new DynamicDerivedSetStore(
      this.fields,
      ($fields: SudokuField[]) =>
        $fields
          .filter((value) => value !== field)
          .map((value) => value.possibleValues),
      ($possibleValuesPerField) => {
        const excludedValues = new Set<string>()
        if (get(field.value) !== undefined) return excludedValues

        for (let k = 1; k <= $possibleValuesPerField.length; k++) {
          const array = $possibleValuesPerField.filter(
            (value: ReadonlySet<string>) => value.size <= k
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
      }
    )
    field.excludedValues.add(excludedValues)
  }
}
