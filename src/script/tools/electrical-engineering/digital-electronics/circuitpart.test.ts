import each from "jest-each";
import { ANDGate, CircuitInput, CircuitPart, NOTGate, ORGate, StaticValue } from "./circuitpart";
import { CircuitInputs } from "./circuit";

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

    const inA = new CircuitInput("A", false)
    const inB = new CircuitInput("A", false)
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
                "A": inA,
                "B": inB
            },
            new ANDGate([
                inA,
                inB
            ]),
            () => inA.value && inB.value
        ],
        [
            "A&!B|!A&B",
            {
                "A": inA,
                "B": inB
            },
            new ORGate([
                new ANDGate([
                    inA,
                    new NOTGate(inB)
                ]),
                new ANDGate([
                    new NOTGate(inA),
                    inB
                ]),
            ]),
            () => inA.value && !inB.value || !inA.value && inB.value
        ],
    ]).it("Test CircuitInputs: '%s'", (str: string, circuitInputs: CircuitInputs, expected: CircuitPart, expectedResult: () => boolean) => {
        for (const combination of matrix) {
            inA.value = combination[0]
            inB.value = combination[1]
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