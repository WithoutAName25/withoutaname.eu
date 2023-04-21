export class Memory {
  private memory = new Map<number, number>()

  constructor(initalMemory: number[]) {
    initalMemory.forEach((value, index) => this.memory.set(index + 1, value))
  }

  public get(address: number): number {
    return this.memory.get(address) || 0
  }

  public set(address: number, value: number): void {
    this.memory.set(address, value)
  }
}
