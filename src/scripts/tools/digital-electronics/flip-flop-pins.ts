import { Ref } from "vue"

export type Pos = "top" | "right" | "bottom" | "left"

export class FlipFlopPin {
  readonly isInput: boolean
  readonly name: string
  readonly ref: Ref<boolean>

  constructor(isInput: boolean, name: string, ref: Ref<boolean>) {
    this.isInput = isInput
    this.name = name
    this.ref = ref
  }
}
