import { Ref } from "vue"

export type Pos = "top" | "right" | "bottom" | "left"

export class FlipFlopPin {
  readonly isInput: Boolean
  readonly name: String
  readonly ref: Ref<Boolean>

  constructor(isInput: Boolean, name: String, ref: Ref<Boolean>) {
    this.isInput = isInput
    this.name = name
    this.ref = ref
  }
}
