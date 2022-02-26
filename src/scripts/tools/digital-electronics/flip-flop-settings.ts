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

export class TimingDiagramSettings {
  show = true
  historyLength = 5
  showQMaster = false
  showQNot = false
}

export class FlipFlopSettings {
  readonly flipFlopType = ref(FlipFlopType.RS)
  readonly clockControl = ref(ClockControl.NONE)
  readonly withPre = ref(false)
  readonly withClr = ref(false)

  readonly timingDiagram = reactive(
    new TimingDiagramSettings()
  ) as TimingDiagramSettings

  readonly qMaster = computed(
    () =>
      this.clockControl.value === ClockControl.DUAL_STATE ||
      this.clockControl.value === ClockControl.DUAL_EDGE
  )

  readonly nonEdgeClockControlAllowed: Ref<Boolean> = computed(
    () =>
      this.flipFlopType.value === FlipFlopType.RS ||
      this.flipFlopType.value === FlipFlopType.D
  )
  readonly preClearAllowed: Ref<Boolean> = computed(
    () => this.clockControl.value !== ClockControl.NONE
  )

  constructor() {
    watch(this.qMaster, (value) => {
      if (!value) {
        this.timingDiagram.showQMaster = false
      }
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
}
