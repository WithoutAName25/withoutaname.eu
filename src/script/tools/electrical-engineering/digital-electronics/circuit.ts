import {Ref} from "vue";

export type CircuitInputs = { [name: string]: CircuitInput };

export class Circuit {

}

export abstract class CircuitPart {

    abstract get(): boolean

    abstract toString(): String

    static fromString(circuitInputs: CircuitInputs, str: string): CircuitPart {
        const openingBrackets = str.split("(").length - 1
        const closingBrackets = str.split(")").length - 1
        for (let i = 0; i < openingBrackets - closingBrackets; i++) {
            str += ")"
        }
        str = str
            .replaceAll(/\|{2,}/g, "|")
            .replaceAll(/&{2,}/g, "&")
            .replaceAll(/((\w|\d){2,})|((\w|\d)!)/g, substring => {
                let newString = substring[0]
                for (let i = 1; i < substring.length; i++) {
                    newString += "&" + substring[i]
                }
                return newString
            })
        return this.internalFromString(circuitInputs, str)
    }

    private static internalFromString(circuitInputs: CircuitInputs, str: string): CircuitPart {
        while (str.startsWith("(") && str.endsWith(")")) {
            str = str.substring(1, str.length - 1)
        }
        if (str === "0") {
            return new StaticValue(false)
        }
        if (str === "1") {
            return new StaticValue(true)
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

    toString(): String {
        return this.name
    }
}

export class StaticValue extends CircuitPart {
    value: boolean

    constructor(value: boolean) {
        super();
        this.value = value
    }

    get(): boolean {
        return this.value
    }

    toString(): String {
        return this.value ? "1" : "0"
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

    toString(): String {
        if (this.inputs[0] instanceof NOTGate ||
            this.inputs[0] instanceof CircuitInput ||
            this.inputs[0] instanceof StaticValue) {
            return "!" + this.inputs[0].toString()
        } else {
            return "!(" + this.inputs[0].toString() + ")"
        }
    }
}

export class ORGate extends Gate {
    get(): boolean {
        for (const input of this.inputs) {
            if (input.get()) return true
        }
        return false;
    }

    toString(): String {
        let str = ""
        for (let i = 0; i < this.inputs.length; i++){
            if (i !== 0) {
                str += "|"
            }
            let input = this.inputs[i];
            if (input instanceof NOTGate ||
                input instanceof CircuitInput ||
                input instanceof StaticValue ||
                input instanceof ANDGate) {
                str += "" + input.toString()
            } else {
                str += "(" + input.toString() + ")"
            }
        }
        return str
    }
}

export class ANDGate extends Gate {
    get(): boolean {
        for (const input of this.inputs) {
            if (!input.get()) return false
        }
        return true
    }

    toString(): String {
        let str = ""
        for (let i = 0; i < this.inputs.length; i++){
            if (i !== 0) {
                str += "&"
            }
            let input = this.inputs[i];
            if (input instanceof NOTGate ||
                input instanceof CircuitInput ||
                input instanceof StaticValue) {
                str += "" + input.toString()
            } else {
                str += "(" + input.toString() + ")"
            }
        }
        return str
    }
}

export class NORGate extends ORGate {
    get(): boolean {
        return !super.get()
    }
    toString(): String {
        return "!(" + super.toString() + ")";
    }
}

export class NANDGate extends ANDGate {
    get(): boolean {
        return !super.get()
    }
    toString(): String {
        return "!(" + super.toString() + ")";
    }
}