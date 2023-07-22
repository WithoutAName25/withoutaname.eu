import { get } from "svelte/store"
import { describe, expect, it } from "vitest"
import {
  ClockControl,
  FlipFlopSettings,
  FlipFlopType,
} from "../../../../../../src/routes/tools/digital-electronics/flip-flops/flip-flop-settings"

describe("Test flip-flop settings", () => {
  it("should switch to edge control", () => {
    const flipFlopSettings = new FlipFlopSettings()
    flipFlopSettings.flipFlopType.set(FlipFlopType.JK)
    const clockControl = get(flipFlopSettings.clockControl)
    expect(
      clockControl === ClockControl.EDGE ||
        clockControl === ClockControl.DUAL_EDGE,
    ).toBeTruthy()
  })
})
