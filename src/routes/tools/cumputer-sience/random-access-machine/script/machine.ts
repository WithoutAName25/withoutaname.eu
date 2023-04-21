import type { Memory } from "./memory"
import type { Program } from "./program"

export class Machine {
  accumulator = 0
  instructionPointer = 0
  operationCounter = 0
  constructor(readonly program: Program, readonly memory: Memory) {}

  step() {
    if (this.instructionPointer >= this.program.instructions.length) {
      throw new Error("Program ended")
    }
    this.program.instructions[this.instructionPointer].applyOn(this)
    this.operationCounter++
  }
}
