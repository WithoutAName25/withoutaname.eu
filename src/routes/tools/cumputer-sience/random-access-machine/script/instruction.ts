import type { Args } from "./args"
import {
  AddressArg,
  DirectAddressArg,
  IndirectAddressArg,
  NumberArg,
  NumberPairArg,
} from "./args"
import type { Machine } from "./machine"

export class Instruction<ArgType extends Args> {
  // prettier-ignore
  public static readonly instructions = [
    ...Instruction.instructionWithInd("LOAD", (machine, args) => {
      machine.accumulator = args.getValue(machine.memory)
      machine.instructionPointer++
    }),
    ...Instruction.instructionWithInd("STORE", (machine, args) => {
      args.setValue(machine.memory, machine.accumulator)
      machine.instructionPointer++
    }),
    new Instruction(/^CLOAD (\d+)$/, (match) => new NumberArg(parseInt(match[1])), (machine, args) => {
      machine.accumulator = args.value
      machine.instructionPointer++
    }),
    ...Instruction.instructionWithInd("ADD", (machine, args) => {
      machine.accumulator += args.getValue(machine.memory)
      machine.instructionPointer++
    }),
    new Instruction(/^CADD (\d+)$/, (match) => new NumberArg(parseInt(match[1])), (machine, args) => {
      machine.accumulator += args.value
      machine.instructionPointer++
    }),
    ...Instruction.instructionWithInd("SUB", (machine, args) => {
      machine.accumulator = Math.max(0, machine.accumulator - args.getValue(machine.memory))
      machine.instructionPointer++
    }),
    new Instruction(/^CSUB (\d+)$/, (match) => new NumberArg(parseInt(match[1])), (machine, args) => {
      machine.accumulator = Math.max(0, machine.accumulator - args.value)
      machine.instructionPointer++
    }),
    ...Instruction.instructionWithInd("MULT", (machine, args) => {
      machine.accumulator *= args.getValue(machine.memory)
      machine.instructionPointer++
    }),
    new Instruction(/^CMULT (\d+)$/, (match) => new NumberArg(parseInt(match[1])), (machine, args) => {
      machine.accumulator *= args.value
      machine.instructionPointer++
    }),
    ...Instruction.instructionWithInd("DIV", (machine, args) => {
      machine.accumulator = Math.floor(machine.accumulator / args.getValue(machine.memory))
      machine.instructionPointer++
    }),
    new Instruction(/^CDIV (\d+)$/, (match) => new NumberArg(parseInt(match[1])), (machine, args) => {
      machine.accumulator = Math.floor(machine.accumulator / args.value)
      machine.instructionPointer++
    }),
    new Instruction(/^GOTO (\d+)$/, (match) => new NumberArg(parseInt(match[1])), (machine, args) => {
      machine.instructionPointer = args.value
    }),
    new Instruction(/^IF c\(0\) = (\d+) GOTO (\d+)$/, (match) => new NumberPairArg(parseInt(match[1]), parseInt(match[2])), (machine, args) => {
      machine.instructionPointer = machine.accumulator === args.value1 ? args.value2 : machine.instructionPointer + 1
    }),
  ]

  private static instructionWithInd(
    name: string,
    apply: (machine: Machine, args: AddressArg) => void
  ) {
    // prettier-ignore
    return [
      new Instruction(new RegExp(`^${name} (\\d+)$`), (match) => new DirectAddressArg(parseInt(match[1])), apply),
      new Instruction(new RegExp(`^IND${name} (\\d+)$`), (match) => new IndirectAddressArg(parseInt(match[1])), apply),
    ]
  }

  constructor(
    private regex: RegExp,
    private getArgs: (match: RegExpMatchArray) => ArgType,
    public readonly apply: (machine: Machine, args: ArgType) => void
  ) {}

  public getInstructionWithArgsIfMatches(line: string) {
    const match = line.match(this.regex)
    if (match) {
      return new InstructionWithArgs(this, this.getArgs(match))
    } else {
      return null
    }
  }
}

export class InstructionWithArgs<ArgType extends Args> {
  constructor(
    public readonly instruction: Instruction<ArgType>,
    public readonly args: ArgType
  ) {}

  public applyOn(machine: Machine) {
    this.instruction.apply(machine, this.args)
  }
}
