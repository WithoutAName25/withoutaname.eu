import { Ref, WatchStopHandle } from "vue"
import { FlipFlopPin } from "~/scripts/tools/digital-electronics/flip-flop-pins"
import { TimingDiagramSettings } from "~/scripts/tools/digital-electronics/flip-flop-settings"

export class FlipFlopHistory {
  pinHistories: Array<PinHistory> = []

  private watch: WatchStopHandle = () => {}
  readonly settings: TimingDiagramSettings

  constructor(settings: TimingDiagramSettings) {
    this.settings = settings
  }

  setPins(pins: Ref<Array<FlipFlopPin> | undefined>) {
    let watchPins = () => {}
    this.watch()
    this.watch = watchEffect(() => {
      const pinValues = new Array<Ref<Boolean>>()
      const pinHistories = new Array<PinHistory>()
      let clockId = -1
      if (pins.value !== undefined) {
        for (let i = 0; i < pins.value.length; i++) {
          pinValues.push(pins.value[i].ref)
          pinHistories.push(new PinHistory(pins.value[i].name, this.settings))
          if (pins.value[i].name === "C") {
            clockId = i
          }
        }
      }
      this.pinHistories = pinHistories
      watchPins()
      watchPins = watch(pinValues, (values, oldValues) => {
        const newInterval =
          clockId === -1 || values[clockId] !== oldValues[clockId]
        for (let i = 0; i < pinHistories.length; i++) {
          pinHistories[i].push(values[i], newInterval)
        }
      })
    })
  }
}

export class PinHistory {
  readonly name: String
  private readonly data: Array<Array<Boolean>>
  private settings: TimingDiagramSettings

  constructor(name: String, settings: TimingDiagramSettings) {
    this.name = name
    this.settings = settings
    this.data = reactive(
      new Array<Array<Boolean>>(new Array<Boolean>(name === "Q'"))
    )
  }

  push(value: Boolean, newInterval: Boolean) {
    if (newInterval) {
      this.data.push(new Array<Boolean>(value))
    } else {
      this.data[this.data.length - 1].push(value)
    }
  }

  getPolyPoints(x: number, y: number, width: number, height: number): string {
    let s = ""
    const intervalWidth = width / this.settings.historyLength
    const startI = this.settings.historyLength - this.data.length
    for (let i = Math.max(startI, 0); i < this.settings.historyLength; i++) {
      const intervalData = this.data[i - startI]
      for (let j = 0; j < intervalData.length; j++) {
        const sectionWidth = intervalWidth / intervalData.length
        const pointX = x + intervalWidth * i + sectionWidth * j
        const pointY = intervalData[j] ? y : y + height
        s += `${pointX},${pointY} ${pointX + sectionWidth},${pointY} `
      }
    }
    return s
  }
}
