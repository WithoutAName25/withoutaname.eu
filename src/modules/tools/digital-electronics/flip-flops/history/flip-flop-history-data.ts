import type { Readable, Unsubscriber, Writable } from "svelte/store"
import { derived, get, writable } from "svelte/store"
import type { FlipFlopPin } from "../flip-flop-pins"
import type { HistorySettings } from "../flip-flop-settings"

export class FlipFlopHistoryData {
  readonly pinHistories = writable<PinHistoryData[]>([])

  private unsubscribe: Unsubscriber = () => undefined
  private unsubscribeInput: Unsubscriber = () => undefined
  private unsubscribeOutput: Unsubscriber = () => undefined
  readonly settings: HistorySettings

  constructor(settings: HistorySettings) {
    this.settings = settings
  }

  setPins(pins: Readable<Array<FlipFlopPin>>) {
    this.unsubscribe()
    this.unsubscribe = pins.subscribe(($pins) => {
      const inputPinValues = new Array<Readable<boolean>>()
      const inputPinHistories = new Array<PinHistoryData>()
      const outputPinValues = new Array<Readable<boolean>>()
      const outputPinHistories = new Array<PinHistoryData>()
      const pinHistories = new Array<PinHistoryData>()
      let clockId = -1
      if ($pins !== undefined) {
        for (let i = 0; i < $pins.length; i++) {
          const pin = $pins[i]
          const pinHistoryData = new PinHistoryData(pin.name, this.settings)
          if (pin.isInput) {
            inputPinValues.push(pin.value)
            inputPinHistories.push(pinHistoryData)
          } else {
            outputPinValues.push(pin.value)
            outputPinHistories.push(pinHistoryData)
          }
          pinHistories.push(pinHistoryData)
          if (pin.name === "C") {
            clockId = i
          }
        }
      }
      this.pinHistories.set(pinHistories)
      let lastClockValue = true
      const inputPinValuesStore = derived(
        inputPinValues,
        ($pinValues) => $pinValues
      )
      this.unsubscribeInput()
      this.unsubscribeInput = inputPinValuesStore.subscribe((values) => {
        const newInterval = clockId === -1 || values[clockId] !== lastClockValue
        if (clockId !== -1) {
          lastClockValue = values[clockId]
        }
        for (let i = 0; i < inputPinHistories.length; i++) {
          inputPinHistories[i].push(values[i], newInterval)
        }
        for (let i = 0; i < outputPinHistories.length; i++) {
          outputPinHistories[i].push(get(outputPinValues[i]), newInterval)
        }
      })
      const outputPinValuesStore = derived(
        outputPinValues,
        ($pinValues) => $pinValues
      )
      this.unsubscribeOutput()
      this.unsubscribeOutput = outputPinValuesStore.subscribe((values) => {
        for (let i = 0; i < outputPinHistories.length; i++) {
          outputPinHistories[i].modifyLast(values[i])
        }
      })
    })
  }
}

export class PinHistoryData {
  readonly name: string
  private settings: HistorySettings
  private readonly data: Writable<boolean[][]>

  constructor(name: string, settings: HistorySettings) {
    this.name = name
    this.settings = settings
    this.data = writable([])
  }

  push(value: boolean, newInterval: boolean) {
    this.data.update(($data) => {
      if (newInterval) {
        $data.push(new Array<boolean>(value))
      } else {
        $data[$data.length - 1].push(value)
      }
      return $data
    })
  }

  modifyLast(value: boolean) {
    this.data.update(($data) => {
      const $subarray = $data[$data.length - 1]
      $subarray[$subarray.length - 1] = value
      return $data
    })
  }

  getPolyPoints(
    x: number,
    y: number,
    width: number,
    height: number
  ): Readable<string> {
    return derived(this.data, ($data) => {
      let s = ""
      const intervalWidth = width / get(this.settings.length)
      const startI = get(this.settings.length) - $data.length
      for (let i = Math.max(startI, 0); i < get(this.settings.length); i++) {
        const intervalData = $data[i - startI]
        for (let j = 0; j < intervalData.length; j++) {
          const sectionWidth = intervalWidth / intervalData.length
          const pointX = x + intervalWidth * i + sectionWidth * j
          const pointY = intervalData[j] ? y : y + height
          s += `${pointX},${pointY} ${pointX + sectionWidth},${pointY} `
        }
      }
      return s
    })
  }
}
