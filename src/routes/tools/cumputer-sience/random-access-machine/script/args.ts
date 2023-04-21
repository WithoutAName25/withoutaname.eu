import type { Memory } from "./memory"

export interface Args {}

export class NumberArg implements Args {
  constructor(public readonly value: number) {}
}

export class NumberPairArg implements Args {
  constructor(public readonly value1: number, public readonly value2: number) {}
}

export abstract class AddressArg implements Args {
  constructor(public readonly address: number) {}

  public abstract getValue(memory: Memory): number

  public abstract setValue(memory: Memory, value: number): void
}

export class DirectAddressArg extends AddressArg {
  public getValue(memory: Memory) {
    return memory.get(this.address)
  }

  public setValue(memory: Memory, value: number) {
    memory.set(this.address, value)
  }
}

export class IndirectAddressArg extends AddressArg {
  public getValue(memory: Memory) {
    return memory.get(memory.get(this.address))
  }

  public setValue(memory: Memory, value: number) {
    memory.set(memory.get(this.address), value)
  }
}
