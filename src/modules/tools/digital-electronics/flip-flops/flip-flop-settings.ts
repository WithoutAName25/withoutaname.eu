import { derived, get, writable } from "svelte/store"

export enum FlipFlopType {
  RS = "rs",
  D = "d",
  JK = "jk",
  T = "t",
}

export enum ClockControl {
  NONE = "none",
  STATE = "state",
  EDGE = "edge",
  DUAL_STATE = "dual_state",
  DUAL_EDGE = "dual_edge",
}

export class HistorySettings {
  show = writable(true)
  length = writable(5)
  showQMaster = writable(false)
  showQNot = writable(false)
}

export class FlipFlopSettings {
  readonly flipFlopType = writable(FlipFlopType.RS)
  readonly clockControl = writable(ClockControl.NONE)
  readonly withPre = writable(false)
  readonly withClr = writable(false)

  readonly history = new HistorySettings()

  readonly dualControlled = derived(
    this.clockControl,
    (clockControl) =>
      clockControl === ClockControl.DUAL_STATE ||
      clockControl === ClockControl.DUAL_EDGE
  )

  readonly edgeControlled = derived(
    this.clockControl,
    ($clockControl) =>
      $clockControl === ClockControl.EDGE ||
      $clockControl === ClockControl.DUAL_EDGE
  )

  readonly nonEdgeClockControlAllowed = derived(
    this.flipFlopType,
    ($flipFlopType) =>
      $flipFlopType === FlipFlopType.RS || $flipFlopType === FlipFlopType.D
  )
  readonly preClearAllowed = derived(
    this.clockControl,
    ($clockControl) => $clockControl !== ClockControl.NONE
  )

  constructor() {
    this.dualControlled.subscribe((value) => {
      if (!value) {
        this.history.showQMaster.set(false)
      }
    })
    this.preClearAllowed.subscribe((value) => {
      if (!value) {
        this.withPre.set(false)
        this.withClr.set(false)
      }
    })
    this.nonEdgeClockControlAllowed.subscribe((value) => {
      if (
        !value &&
        get(this.clockControl) !== ClockControl.EDGE &&
        get(this.clockControl) !== ClockControl.DUAL_EDGE
      ) {
        this.clockControl.set(ClockControl.EDGE)
      }
    })
  }
}
