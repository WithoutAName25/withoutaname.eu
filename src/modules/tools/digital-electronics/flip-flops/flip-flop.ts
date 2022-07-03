import type { Readable } from "svelte/store"
import { derived, get, writable } from "svelte/store"
import type { Pos } from "./flip-flop-pins"
import { FlipFlopPin } from "./flip-flop-pins"
import type { FlipFlopSettings } from "./flip-flop-settings"
import { ClockControl, FlipFlopType } from "./flip-flop-settings"
import { FlipFlopHistoryData } from "./history/flip-flop-history-data"

export class FlipFlop {
  readonly settings: FlipFlopSettings
  readonly i0 = writable(false)
  readonly iC = writable(false)
  readonly i1 = writable(false)
  readonly iPre = writable(false)
  readonly iClr = writable(false)

  private qMaster = writable(false)

  readonly oQ = writable(false)
  readonly oQNot = writable(true)

  readonly pins = new Map<Pos, Readable<Array<FlipFlopPin>>>()

  readonly history: FlipFlopHistoryData

  constructor(settings: FlipFlopSettings) {
    this.settings = settings
    this.history = new FlipFlopHistoryData(this.settings.history)
    this.setupDefaults()
    this.watchInputs()
    this.setupPins()
  }

  private setupDefaults() {
    derived(
      [this.settings.flipFlopType, this.settings.clockControl],
      ($value) => $value
    ).subscribe(() => {
      this.i0.set(false)
      this.iC.set(false)
      this.i1.set(false)
      this.iPre.set(false)
      this.iClr.set(false)

      this.qMaster.set(false)

      this.oQ.set(false)
      this.oQNot.set(true)
    })
  }

  private watchInputs() {
    derived(
      [this.i0, this.i1, this.iPre, this.iClr],
      ($value) => $value
    ).subscribe(([, , iPre, iClr]) => {
      if (iPre || iClr) {
        this.qMaster.set(iPre)
        this.oQ.set(iPre)
        this.oQNot.set(iClr)
      } else if (
        get(this.settings.clockControl) === ClockControl.NONE ||
        (get(this.iC) &&
          (get(this.settings.clockControl) === ClockControl.STATE ||
            get(this.settings.clockControl) === ClockControl.DUAL_STATE))
      ) {
        this.update()
      }
    })
    this.iC.subscribe((iC) => {
      if (iC) {
        this.update()
      } else if (
        get(this.settings.clockControl) === ClockControl.DUAL_STATE ||
        get(this.settings.clockControl) === ClockControl.DUAL_EDGE
      ) {
        this.oQ.set(get(this.qMaster))
        this.oQNot.set(!get(this.qMaster))
      }
    })
  }

  private update() {
    if (get(this.iPre) || get(this.iClr)) {
      this.qMaster.set(get(this.iPre))
      this.oQ.set(get(this.iPre))
      this.oQNot.set(get(this.iClr))
      return
    }

    const type = get(this.settings.flipFlopType)

    let set = get(this.i0)
    let reset = get(this.i1)
    if (type === FlipFlopType.D) {
      reset = !set
    } else if (
      (type === FlipFlopType.T && set) ||
      (type === FlipFlopType.JK && set && reset)
    ) {
      set = !get(this.oQ)
      reset = get(this.oQ)
    }
    this.updateInternal(set, reset)
  }

  private updateInternal(set: boolean, reset: boolean) {
    if (reset) {
      this.qMaster.set(false)
    } else if (set) {
      this.qMaster.set(true)
    }
    if (
      get(this.settings.clockControl) !== ClockControl.DUAL_STATE &&
      get(this.settings.clockControl) !== ClockControl.DUAL_EDGE
    ) {
      if (set && reset) {
        this.oQ.set(false)
        this.oQNot.set(false)
      } else {
        this.oQ.set(get(this.qMaster))
        this.oQNot.set(!get(this.qMaster))
      }
    }
  }

  private setupPins() {
    const left = derived(
      [this.settings.flipFlopType, this.settings.clockControl],
      ([$flipFlopType, $clockControl]) => {
        const pins = new Array<FlipFlopPin>()
        pins.push(
          new FlipFlopPin(
            true,
            $flipFlopType === FlipFlopType.RS
              ? "S"
              : $flipFlopType.toString().charAt(0).toUpperCase(),
            this.i0
          )
        )
        if ($clockControl !== ClockControl.NONE) {
          pins.push(new FlipFlopPin(true, "C", this.iC))
        }
        if (
          $flipFlopType === FlipFlopType.RS ||
          $flipFlopType === FlipFlopType.JK
        ) {
          pins.push(
            new FlipFlopPin(
              true,
              $flipFlopType === FlipFlopType.RS ? "R" : "K",
              this.i1
            )
          )
        }
        return pins
      }
    )
    const top = derived(this.settings.withPre, ($withPre) => {
      const pins = new Array<FlipFlopPin>()
      if ($withPre) {
        pins.push(new FlipFlopPin(true, "Pre", this.iPre))
      }
      return pins
    })
    const bottom = derived(this.settings.withClr, ($withClr) => {
      const pins = new Array<FlipFlopPin>()
      if ($withClr) {
        pins.push(new FlipFlopPin(true, "Clr", this.iClr))
      }
      return pins
    })
    const right = derived([], () => {
      const pins = new Array<FlipFlopPin>()
      pins.push(
        new FlipFlopPin(false, "Q", this.oQ),
        new FlipFlopPin(false, "Q'", this.oQNot)
      )
      return pins
    })

    this.pins.set("left", left)
    this.pins.set("top", top)
    this.pins.set("bottom", bottom)
    this.pins.set("right", right)

    const pinQMaster = new FlipFlopPin(false, "Qm", this.qMaster)

    const allPins = derived(
      [left, top, bottom, right],
      ([left, top, bottom, right]) => {
        return left.concat(top, bottom, [pinQMaster], right)
      }
    )
    this.history.setPins(allPins)
  }
}
