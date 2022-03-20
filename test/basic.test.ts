import { describe, expect, it } from "vitest"
import { FlipFlop } from "~/scripts/tools/digital-electronics/flip-flop"
import { FlipFlopSettings } from "~/scripts/tools/digital-electronics/flip-flop-settings"

describe("tests", () => {
  it("should works", () => {
    new FlipFlop(new FlipFlopSettings())
    expect(1 + 1).toEqual(2)
  })
})
