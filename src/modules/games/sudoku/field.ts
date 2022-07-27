import type { Readable, Writable } from "svelte/store"
import { derived, writable } from "svelte/store"
import { DynamicDerived } from "../../../scripts/store"
import { isSetEqual } from "../../../scripts/utils"
import { DEFAULT_ALLOWED_VALUES } from "./grid"

export class SudokuField {
  constructor(readonly allowedValues = DEFAULT_ALLOWED_VALUES) {}

  readonly value: Writable<string | undefined> = writable(undefined)
  readonly forcedValues: Writable<Readable<ForcedValue>[]> = writable([])
  readonly excludedValuesPerConstraint = writable<
    Readable<ReadonlySet<string>>[]
  >([
    derived(this.value, ($value) => {
      if ($value === undefined) return new Set<string>()

      const excludedValues = new Set(this.allowedValues)
      excludedValues.delete($value)
      return excludedValues
    }),
  ])
  readonly possibleValues: Readable<ReadonlySet<string>> = new DynamicDerived(
    this.excludedValuesPerConstraint,
    ($values) => $values,
    ($excludedValuesPerConstraint) => {
      const possibleValues = new Set<string>(this.allowedValues)
      for (const value of this.allowedValues) {
        for (const excludedValues of $excludedValuesPerConstraint) {
          if (excludedValues.has(value)) {
            possibleValues.delete(value)
            break
          }
        }
      }
      return possibleValues
    },
    isSetEqual
  )
}

export class ForcedValue {
  constructor(readonly value: string, readonly possibleFields: SudokuField[]) {}
}
