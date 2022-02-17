import { reactive } from "vue";

export class SingleTimingData {
    readonly name: String
    readonly data: Array<Boolean>

    constructor(name: String, data: Array<Boolean>) {
        this.name = name
        this.data = data
    }

    getPolylinePoints(x: number, y: number, dx: number, dy: number): String {
        let s = ""
        for (let i = 0; i < this.data.length; i++) {
            if (i != 0) s += " "
            s += `${ x + i * dx },${ this.data[i] ? y : (y + dy) } ${ x + (i + 1) * dx },${ this.data[i] ? y : (y + dy) }`
        }
        return s
    }
}

export class TimingData {
    readonly timingData: Array<SingleTimingData>
    size: number

    constructor(timingData: Array<SingleTimingData>, size: number) {
        this.timingData = reactive(timingData)
        this.size = size
    }

    push(value: Array<Boolean>) {
        for (let i = 0; i < value.length && i < this.timingData.length; i++) {
            let data = this.timingData[i].data;
            data.push(value[i])
            while (data.length > this.size) {
                data.shift()
            }
        }
    }
}