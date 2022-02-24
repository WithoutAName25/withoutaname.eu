import { Ref } from "vue"

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

export class FlipFlopSettings {
  constructor() {
    this.preClearAllowed = computed(() => {
      return this.clockControl.value !== ClockControl.NONE
    })
    this.nonEdgeClockControlAllowed = computed(() => {
      return (
        this.flipFlopType.value === FlipFlopType.RS ||
        this.flipFlopType.value === FlipFlopType.D
      )
    })
    watch(this.preClearAllowed, (value) => {
      if (!value) {
        this.withPre.value = false
        this.withClr.value = false
      }
    })
    watch(this.nonEdgeClockControlAllowed, (value) => {
      if (
        !value &&
        this.clockControl.value !== ClockControl.EDGE &&
        this.clockControl.value !== ClockControl.DUAL_EDGE
      ) {
        this.clockControl.value = ClockControl.EDGE
      }
    })
  }
  readonly flipFlopType = ref(FlipFlopType.RS)
  readonly nonEdgeClockControlAllowed: Ref<Boolean>
  readonly clockControl = ref(ClockControl.NONE)
  readonly preClearAllowed: Ref<Boolean>
  readonly withPre = ref(false)
  readonly withClr = ref(false)
}
