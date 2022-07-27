import { throwError } from "svelte-preprocess/dist/modules/errors"
import type { Readable, Subscriber, Unsubscriber } from "svelte/store"
import { derived } from "svelte/store"

export class DynamicDerived<T, V, R> implements Readable<R> {
  private readonly subscribers: Subscriber<R>[] = []
  private value: R

  constructor(
    valuesStore: Readable<T>,
    transform: (value: T) => Readable<V>[],
    callback: (values: V[]) => R,
    isEqual: (oldValue: R, newValue: R) => boolean = (a, b) => a === b
  ) {
    let initialValue: R | undefined
    let unsubscribe: Unsubscriber = () => undefined
    valuesStore.subscribe((values) => {
      unsubscribe()

      const stores = transform(values)
      unsubscribe = derived(stores, ($values) => $values).subscribe(
        ($values) => {
          const value = callback($values)
          if (this.value === undefined || !isEqual(this.value, value)) {
            initialValue = value
            this.value = value
            this.subscribers.forEach((subscriber) => subscriber(this.value))
          }
        }
      )
    })
    this.value =
      initialValue ?? throwError("subscribe should call callback immediately")
  }

  subscribe(subscriber: Subscriber<R>): Unsubscriber {
    subscriber(this.value)
    this.subscribers.push(subscriber)
    return () =>
      this.subscribers.splice(this.subscribers.indexOf(subscriber), 1)
  }
}
