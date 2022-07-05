import type { Subscriber, Writable } from "svelte/store"
import { get, writable } from "svelte/store"
import { describe, expect, test, vi } from "vitest"
import { DynamicDerived } from "../../../src/scripts/store"

class TestClass {
  test: Writable<number> = writable(0)
}

describe("Dynamic derived store", () => {
  function getSumStore(testArray: Writable<TestClass[]>) {
    return new DynamicDerived(
      testArray,
      (values) => values.map((value) => value.test),
      (values) => values.reduce((acc, value) => acc + value, 0)
    )
  }
  test("should update when value is changed", () => {
    const testA = new TestClass()
    const testB = new TestClass()
    testA.test.set(5)
    testB.test.set(7)

    const testArray = writable([testA, testB])

    const customTestStore = getSumStore(testArray)

    expect(get(customTestStore)).toBe(12)

    testA.test.set(10)

    expect(get(customTestStore)).toBe(17)
  })

  test("should update when array is changed", () => {
    const testA = new TestClass()
    const testB = new TestClass()
    testA.test.set(5)
    testB.test.set(7)

    const testArray = writable([testA])

    const customTestStore = getSumStore(testArray)

    expect(get(customTestStore)).toBe(5)

    testArray.update((array) => {
      array.push(testB)
      return array
    })

    expect(get(customTestStore)).toBe(12)
  })

  test("should call subscriber when value is changed", () => {
    const testA = new TestClass()
    const testB = new TestClass()
    testA.test.set(5)
    testB.test.set(0)

    const sumStore = getSumStore(writable([testA]))

    const subscriber: Subscriber<number> = vi.fn()

    sumStore.subscribe(subscriber)
    expect(subscriber).toHaveBeenCalledWith(5)

    testA.test.set(10)
    expect(subscriber).toHaveBeenCalledWith(10)
  })

  test("should call subscriber when array is changed", () => {
    const testA = new TestClass()
    const testB = new TestClass()
    testA.test.set(5)
    testB.test.set(7)

    const testArray = writable([testA])
    const sumStore = getSumStore(testArray)

    const subscriber: Subscriber<number> = vi.fn()

    sumStore.subscribe(subscriber)
    expect(subscriber).toHaveBeenCalledWith(5)

    testArray.update(($testArray) => {
      $testArray.push(testB)
      return $testArray
    })
    expect(subscriber).toHaveBeenCalledWith(12)
  })

  test("should not call subscriber when result is unchanged", () => {
    const testA = new TestClass()
    const testB = new TestClass()
    testA.test.set(5)
    testB.test.set(0)

    const testArray = writable([testA])
    const sumStore = getSumStore(testArray)

    const subscriber: Subscriber<number> = vi.fn()

    sumStore.subscribe(subscriber)
    expect(subscriber).toHaveBeenCalledWith(5)

    testArray.update(($testArray) => {
      $testArray.push(testB)
      return $testArray
    })
    expect(subscriber).toHaveBeenCalledOnce()
  })
})
