import { Ref } from "vue"
import { FlipFlopHistory } from "~/scripts/tools/digital-electronics/flip-flop-history"
import {
  FlipFlopPin,
  Pos,
} from "~/scripts/tools/digital-electronics/flip-flop-pins"
import {
  ClockControl,
  FlipFlopSettings,
  FlipFlopType,
} from "~/scripts/tools/digital-electronics/flip-flop-settings"

export class FlipFlop {
  readonly settings: FlipFlopSettings
  readonly i0 = ref(false)
  readonly iC = ref(false)
  readonly i1 = ref(false)
  readonly iPre = ref(false)
  readonly iClr = ref(false)

  private qNext = ref(false)

  readonly oQ = ref(false)
  readonly oQNot = ref(true)

  readonly pins = new Map<Pos, Ref<Array<FlipFlopPin>>>()

  readonly history = ref<FlipFlopHistory>()

  constructor(settings: FlipFlopSettings) {
    this.settings = settings
    this.setupDefaults()
    this.watchInputs()
    this.setupPins()
  }

  private setupDefaults() {
    watch([this.settings.flipFlopType, this.settings.clockControl], () => {
      this.i0.value = false
      this.iC.value = false
      this.i1.value = false
      this.iPre.value = false
      this.iClr.value = false

      this.qNext.value = false

      this.oQ.value = false
      this.oQNot.value = true
    })
  }

  private watchInputs() {
    watch([this.i0, this.i1, this.iPre, this.iClr], ([, , iPre, iClr]) => {
      if (iPre || iClr) {
        this.qNext.value = this.iPre.value
        this.oQ.value = this.iPre.value
        this.oQNot.value = this.iClr.value
      } else if (
        this.settings.clockControl.value === ClockControl.NONE ||
        (this.iC.value &&
          (this.settings.clockControl.value === ClockControl.STATE ||
            this.settings.clockControl.value === ClockControl.DUAL_STATE))
      ) {
        this.update()
      }
    })
    watch(this.iC, (c) => {
      if (c) {
        this.update()
      } else if (
        this.settings.clockControl.value === ClockControl.DUAL_STATE ||
        this.settings.clockControl.value === ClockControl.DUAL_EDGE
      ) {
        this.oQ.value = this.qNext.value
        this.oQNot.value = !this.qNext.value
      }
    })
  }

  private update() {
    if (this.iPre.value || this.iClr.value) {
      this.qNext.value = this.iPre.value
      this.oQ.value = this.iPre.value
      this.oQNot.value = this.iClr.value
      return
    }

    const type = this.settings.flipFlopType.value

    let set = this.i0.value
    let reset = this.i1.value

    if (type === FlipFlopType.D) {
      reset = !set
    } else if (
      type === FlipFlopType.T ||
      (type === FlipFlopType.JK && set && reset)
    ) {
      set = !this.oQ.value
      reset = this.oQ.value
    }
    this.updateInternal(reset, set)
  }

  private updateInternal(reset: boolean, set: boolean) {
    if (reset) {
      this.qNext.value = false
    } else if (set) {
      this.qNext.value = true
    }
    if (
      this.settings.clockControl.value !== ClockControl.DUAL_STATE &&
      this.settings.clockControl.value !== ClockControl.DUAL_EDGE
    ) {
      if (set && reset) {
        this.oQ.value = false
        this.oQNot.value = false
      } else {
        this.oQ.value = this.qNext.value
        this.oQNot.value = !this.qNext.value
      }
    }
  }

  private setupPins() {
    const left = computed(() => {
      const pins = new Array<FlipFlopPin>()
      pins.push(
        new FlipFlopPin(
          true,
          this.settings.flipFlopType.value === FlipFlopType.RS
            ? "S"
            : this.settings.flipFlopType.value
                .toString()
                .charAt(0)
                .toUpperCase(),
          this.i0
        )
      )
      if (this.settings.clockControl.value !== ClockControl.NONE) {
        pins.push(new FlipFlopPin(true, "C", this.iC))
      }
      if (
        this.settings.flipFlopType.value === FlipFlopType.RS ||
        this.settings.flipFlopType.value === FlipFlopType.JK
      ) {
        pins.push(
          new FlipFlopPin(
            true,
            this.settings.flipFlopType.value === FlipFlopType.RS ? "R" : "K",
            this.i1
          )
        )
      }
      return pins
    })
    const top = computed(() => {
      const pins = new Array<FlipFlopPin>()
      if (this.settings.withPre.value) {
        pins.push(new FlipFlopPin(true, "Pre", this.iPre))
      }
      return pins
    })
    const bottom = computed(() => {
      const pins = new Array<FlipFlopPin>()
      if (this.settings.withClr.value) {
        pins.push(new FlipFlopPin(true, "Clr", this.iClr))
      }
      return pins
    })
    const right = computed(() => {
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

    const allPins = computed(() => {
      return left.value.concat(top.value, bottom.value, right.value)
    })
    this.history.value = new FlipFlopHistory(allPins)
  }
}
