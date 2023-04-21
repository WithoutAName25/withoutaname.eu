import type { Memory } from "./memory"

export class Machine {
  readonly memory: Memory
  accumulator = 0
  instructionPointer = 0

  constructor(memory: Memory) {
    this.memory = memory
  }
}
