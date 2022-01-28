import each from "jest-each";
import {ANDGate, CircuitInput, CircuitInputs, CircuitPart, NOTGate, ORGate, StaticValue} from "./circuit";
import {ref} from "vue";

describe("Test circuit parts", () => {

    function test(str: string, expected: CircuitPart, expectedResult: boolean) {
        let circuitPart = CircuitPart.fromString({}, str);
        expect(circuitPart).toStrictEqual(expected)
        expect(circuitPart.get()).toBe(expectedResult)
        expect(circuitPart.toString()).toBe(str)
    }

    each([
        ["StaticValue", "0", new StaticValue(false), false],
        ["StaticValue", "1", new StaticValue(true), true],
        ["NotGate", "!0", new NOTGate(new StaticValue(false)), true],
        ["NotGate", "!1", new NOTGate(new StaticValue(true)), false],
        ["OrGate", "0|0", new ORGate([new StaticValue(false), new StaticValue(false)]), false],
        ["OrGate", "0|1", new ORGate([new StaticValue(false), new StaticValue(true)]), true],
        ["OrGate", "1|0", new ORGate([new StaticValue(true), new StaticValue(false)]), true],
        ["OrGate", "1|1", new ORGate([new StaticValue(true), new StaticValue(true)]), true],
        ["AndGate", "0&0", new ANDGate([new StaticValue(false), new StaticValue(false)]), false],
        ["AndGate", "0&1", new ANDGate([new StaticValue(false), new StaticValue(true)]), false],
        ["AndGate", "1&0", new ANDGate([new StaticValue(true), new StaticValue(false)]), false],
        ["AndGate", "1&1", new ANDGate([new StaticValue(true), new StaticValue(true)]), true],
    ]).it("Test %s: '%s'", (_: string, str: string, expected: CircuitPart, expectedResult: boolean) => {
        test(str, expected, expectedResult)
    })

    each([
        [
            "0&1|1&0",
            new ORGate([
                new ANDGate([
                    new StaticValue(false),
                    new StaticValue(true)]
                ),
                new ANDGate([
                    new StaticValue(true),
                    new StaticValue(false)]
                )]
            ),
            false
        ],
        [
            "1&(1|0)&1",
            new ANDGate([
                new StaticValue(true),
                new ORGate([
                    new StaticValue(true),
                    new StaticValue(false)
                ]),
                new StaticValue(true),
            ]),
            true
        ],
        [
            "!0&!(0&1)|!0&1&!(0|0)",
            new ORGate([
                new ANDGate([
                    new NOTGate(new StaticValue(false)),
                    new NOTGate(new ANDGate([
                        new StaticValue(false),
                        new StaticValue(true)
                    ])),
                ]),
                new ANDGate([
                    new NOTGate(new StaticValue(false)),
                    new StaticValue(true),
                    new NOTGate(new ORGate([
                        new StaticValue(false),
                        new StaticValue(false)
                    ]))
                ])
            ]),
            true
        ],
    ]).it("Test complex circuit: '%s'", (str: string, expected: CircuitPart, expectedResult: boolean) => {
        test(str, expected, expectedResult);
    })

    const refA = ref(false)
    const refB = ref(false)
    const matrix = [
        [false, false],
        [false, true],
        [true, false],
        [true, true]
    ]
    each([
        [
            "A&B",
            {
                "A": new CircuitInput("A", refA),
                "B": new CircuitInput("B", refB)
            },
            new ANDGate([
                new CircuitInput("A", refA),
                new CircuitInput("B", refB)
            ]),
            () => refA.value && refB.value
        ],
        [
            "A&!B|!A&B",
            {
                "A": new CircuitInput("A", refA),
                "B": new CircuitInput("B", refB)
            },
            new ORGate([
                new ANDGate([
                    new CircuitInput("A", refA),
                    new NOTGate(new CircuitInput("B", refB))
                ]),
                new ANDGate([
                    new NOTGate(new CircuitInput("A", refA)),
                    new CircuitInput("B", refB)
                ]),
            ]),
            () => refA.value && !refB.value || !refA.value && refB.value
        ],
    ]).it("Test CircuitInputs: '%s'", (str: string, circuitInputs: CircuitInputs, expected: CircuitPart, expectedResult: () => boolean) => {
        for (const combination of matrix) {
            refA.value = combination[0]
            refB.value = combination[1]
            let circuitPart = CircuitPart.fromString(circuitInputs, str);
            expect(circuitPart).toStrictEqual(expected)
            expect(circuitPart.get()).toBe(expectedResult())
            expect(circuitPart.toString()).toBe(str)
        }
    })

    each([
        ["010", "0&1&0"],
        ["0!1|(!0!0)", "0&!1|!0&!0"],
        ["!(!01", "!(!0&1)"],
        ["1|0&&&!1|||0", "1|0&!1|0"],
        ["!(!(!(1)))", "!!!1"],
        ["!(!(!(0", "!!!0"],
    ]).it("Test special inputs: '%s'", (str: string, expected: string) => {
        let circuitPart = CircuitPart.fromString({}, str);
        expect(circuitPart.toString()).toBe(expected)
    })
})