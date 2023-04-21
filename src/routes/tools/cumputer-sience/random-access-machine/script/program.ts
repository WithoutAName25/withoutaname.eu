import type { InstructionWithArgs } from "./instruction"
import { Instruction } from "./instruction"

export class Program {
  readonly instructions: InstructionWithArgs<any>[]

  constructor(lines: string[]) {
    this.instructions = lines.map((line) => {
      let instruction: InstructionWithArgs<any> | null = null
      for (const instr of Instruction.instructions) {
        instruction = instr.getInstructionWithArgsIfMatches(line)
        if (instruction !== null) break
      }
      if (instruction === null) {
        throw new Error(`Invalid instruction: ${line}`)
      }
      return instruction
    })
  }
}
