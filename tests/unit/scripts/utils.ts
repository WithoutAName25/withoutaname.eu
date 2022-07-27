import { describe, expect, test, vi } from "vitest"
import { applyToAllCombinations, isSetEqual } from "../../../src/scripts/utils"

describe("utils", () => {
  test("isSetEqual", () => {
    expect(isSetEqual(new Set<string>(), new Set<string>())).toBe(true)
    expect(isSetEqual(new Set<string>(), new Set<string>(["a"]))).toBe(false)
    expect(isSetEqual(new Set<string>(["a"]), new Set<string>())).toBe(false)
    expect(isSetEqual(new Set<string>(["a"]), new Set<string>(["a"]))).toBe(
      true
    )
    expect(isSetEqual(new Set<string>(["a"]), new Set<string>(["b"]))).toBe(
      false
    )
    expect(
      isSetEqual(new Set<string>(["a"]), new Set<string>(["a", "b"]))
    ).toBe(false)
  })

  test("applyToAllCombinations", () => {
    const fn = vi.fn()
    applyToAllCombinations([1, 2, 3, 4], 2, fn)
    expect(fn).toHaveBeenCalledTimes(6)
    expect(fn).toHaveBeenCalledWith([1, 2])
    expect(fn).toHaveBeenCalledWith([1, 3])
    expect(fn).toHaveBeenCalledWith([1, 4])
    expect(fn).toHaveBeenCalledWith([2, 3])
    expect(fn).toHaveBeenCalledWith([2, 4])
    expect(fn).toHaveBeenCalledWith([3, 4])
  })
})
