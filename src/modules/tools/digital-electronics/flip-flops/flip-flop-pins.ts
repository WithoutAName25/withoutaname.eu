import type { Writable } from "svelte/store"

export type Pos = "top" | "right" | "bottom" | "left"

export class FlipFlopPin {
  readonly isInput: boolean
  readonly name: string
  readonly value: Writable<boolean>

  constructor(isInput: boolean, name: string, ref: Writable<boolean>) {
    this.isInput = isInput
    this.name = name
    this.value = ref
  }
}
