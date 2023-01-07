import type { Readable, Writable } from "svelte/store"
import { derived, writable } from "svelte/store"
import {
  DerivedSetCombination,
  DerivedSetStore,
  ReadableSetStore,
  WritableSetStore,
} from "../../../scripts/store"
import { DEFAULT_ALLOWED_VALUES } from "./grid"

export class SudokuField {
  constructor(readonly allowedValues = DEFAULT_ALLOWED_VALUES) {}

  readonly value: Writable<string | undefined> = writable(undefined)
  readonly excludedValues = new WritableSetStore<ReadableSetStore<string>>(
    new Set([
      new DerivedSetStore(this.value, ($value: string | undefined) => {
        if ($value === undefined) return new Set<string>()

        const excludedValues = new Set(this.allowedValues)
        excludedValues.delete($value)
        return excludedValues
      }),
    ])
  )
  readonly possibleValues: Readable<ReadonlySet<string>> = derived(
    new DerivedSetCombination(this.excludedValues),
    (values) => {
      const possibleValues = new Set(this.allowedValues)
      values.forEach((value) => possibleValues.delete(value))
      return possibleValues
    }
  )
}

export class ForcedValue {
  constructor(readonly value: string, readonly possibleFields: SudokuField[]) {}
}
