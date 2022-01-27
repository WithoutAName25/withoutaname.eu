import {Ref} from "vue";

export type CircuitInputs = { [name: string]: CircuitInput };

export class Circuit {

}

export abstract class CircuitPart {

    abstract get(): boolean

    static fromString(circuitInputs: CircuitInputs, str: string): CircuitPart {
        // TODO handle wrong user inputs
        return this.internalFromString(circuitInputs, str)
    }

    private static internalFromString(circuitInputs: CircuitInputs, str: string): CircuitPart {
        while (str.startsWith("(") && str.endsWith(")")) {
            str = str.substring(1, str.length - 1)
        }
        if (circuitInputs[str]) {
            return circuitInputs[str]
        }
        let inputStrings = this.getInputStrings(str, "|")
        if (inputStrings.length > 1) {
            return new ORGate(this.getInputs(circuitInputs, inputStrings))
        }
        inputStrings = this.getInputStrings(str, "&")
        if (inputStrings.length > 1) {
            return new ANDGate(this.getInputs(circuitInputs, inputStrings))
        }
        if (str.startsWith("!")) {
            return new NOTGate(this.internalFromString(circuitInputs, str.substring(1)))
        }
        return new StaticValue(false)
    }

    private static getInputStrings(str: string, operator: string): string[] {
        let depth = 0
        let strings = [""]
        for (let char of str) {
            if (char === operator && depth === 0) {
                strings.push("")
            } else {
                strings[strings.length - 1] += char
                if (char === "(") {
                    depth++
                } else if (char === ")" && depth > 0) {
                    depth--
                }
            }
        }
        return strings
    }

    private static getInputs(circuitInputs: CircuitInputs, inputStrings: string[]): CircuitPart[] {
        return inputStrings.map(value => this.internalFromString(circuitInputs, value))
    }
}

export class CircuitInput extends CircuitPart {
    readonly name: string
    readonly valueRef: Ref<boolean>

    constructor(name: string, valueRef: Ref<boolean>) {
        super()
        this.name = name
        this.valueRef = valueRef
    }

    get(): boolean {
        return this.valueRef.value;
    }
}

export class StaticValue extends CircuitPart {
    value: boolean

    constructor(value: boolean) {
        super();
        this.value = value
    }

    get(): boolean {
        return false
    }
}

export abstract class Gate extends CircuitPart {
    protected inputs: CircuitPart[]

    constructor(inputs: CircuitPart[]) {
        super()
        this.inputs = inputs
    }

    abstract get(): boolean
}

export class NOTGate extends Gate {
    constructor(input: CircuitPart) {
        super([input])
    }

    get(): boolean {
        return !this.inputs[0].get()
    }
}

export class ORGate extends Gate {
    get(): boolean {
        for (const input of this.inputs) {
            if (input.get()) return true
        }
        return false;
    }
}

export class ANDGate extends Gate {
    get(): boolean {
        for (const input of this.inputs) {
            if (!input.get()) return false
        }
        return true
    }
}

export class NORGate extends ORGate {
    get(): boolean {
        return !super.get()
    }
}

export class NANDGate extends ANDGate {
    get(): boolean {
        return !super.get()
    }
}