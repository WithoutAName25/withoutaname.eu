import { CircuitInput, CircuitPart, StaticValue } from "./circuitpart";
import { reactive, ref, Ref, watch } from "vue";

export type CircuitInputs = { [name: string]: CircuitInput };

export class Circuit {
    readonly variables: string[];
    readonly functionStr: Ref<string>;
    readonly inputRefs: CircuitInput[] = reactive([])
    readonly circuit: Ref<CircuitPart> = ref(new StaticValue(false))

    constructor(variables: string[], functionStr: Ref<string>) {
        this.variables = variables;
        this.functionStr = functionStr;
        watch(variables, () => {
            this.updateInputRefs()
            this.updateCircuit()
        })
        watch(functionStr, () => {
            this.updateCircuit()
        })
        this.updateInputRefs()
        this.updateCircuit()
    }

    updateInputRefs() {
        while (this.variables.length > this.inputRefs.length) {
            this.inputRefs.push(new CircuitInput(this.variables[this.inputRefs.length], false))
        }
        while (this.variables.length < this.inputRefs.length) {
            this.inputRefs.pop()
        }
    }

    updateCircuit() {
        const inputs: CircuitInputs = {}
        for (let i = 0; i < this.variables.length; i++) {
            inputs[this.variables[i]] = this.inputRefs[i]
        }
        this.circuit.value = CircuitPart.fromString(inputs, this.functionStr.value)
    }

    getPossibleInputs(): boolean[][] {
        const inputs: boolean[][] = []
        const count = 2 ** this.variables.length
        for (let i = 0; i < count; i++) {
            const input: boolean[] = []
            for (let j = 0; j < this.variables.length; j++) {
                input.push((i >> j & 1) == 1)
            }
            inputs.push(input)
        }
        return inputs
    }

    getValue(inputs: boolean[]) {
        for (let i = 0; i < this.inputRefs.length; i++) {
            this.inputRefs[i].value = inputs[i]
        }
        return this.circuit.value.get()
    }
}