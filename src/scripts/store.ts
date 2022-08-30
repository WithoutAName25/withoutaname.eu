import type {
  Readable,
  Subscriber,
  Unsubscriber,
  Updater,
  Writable,
} from "svelte/store"
import { derived, get } from "svelte/store"

export class BasicReadable<T> implements Readable<T> {
  private subscribers: Set<Subscriber<T>> = new Set()

  constructor(protected value: T) {}

  protected set(value: T): void {
    this.value = value
    this.notifySubscribers()
  }

  protected notifySubscribers() {
    this.notify(this.value, this.subscribers)
  }

  protected notify<S>(value: S, subscribers: Set<Subscriber<S>>) {
    if (value === undefined) return
    subscribers.forEach((subscriber) => subscriber(value))
  }

  subscribe(run: Subscriber<T>): Unsubscriber {
    this.subscribers.add(run)
    if (this.value !== undefined) run(this.value)
    return () => this.subscribers.delete(run)
  }

  protected update(updater: Updater<T>): void {
    this.set(updater(this.value))
  }
}

export class BasicWritable<T> extends BasicReadable<T> implements Writable<T> {
  public set(value: T) {
    super.set(value)
  }

  public update(updater: Updater<T>) {
    super.update(updater)
  }
}

export class ReadableSetStore<T> extends BasicReadable<Set<T>> {
  private onAddSubscribers: Set<Subscriber<T>> = new Set()
  private onDeleteSubscribers: Set<Subscriber<T>> = new Set()

  constructor(value?: Set<T>) {
    super(value ?? new Set())
  }

  protected add(item: T): void {
    this.value.add(item)
    this.notifySubscribers()
    this.notify(item, this.onAddSubscribers)
  }

  protected delete(item: T): void {
    this.value.delete(item)
    this.notifySubscribers()
    this.notify(item, this.onDeleteSubscribers)
  }

  protected set(newValue: Set<T>) {
    let hasChanged = false
    for (const value of this.value)
      if (!newValue.has(value)) {
        this.notify(value, this.onDeleteSubscribers)
        hasChanged = true
      }
    for (const value of newValue)
      if (!this.value.has(value)) {
        this.notify(value, this.onAddSubscribers)
        hasChanged = true
      }
    if (hasChanged) super.set(newValue)
  }

  onAdd(run: Subscriber<T>): Unsubscriber {
    this.onAddSubscribers.add(run)
    for (const value of this.value) {
      run(value)
    }
    return () => this.onAddSubscribers.delete(run)
  }

  onDelete(run: Subscriber<T>): Unsubscriber {
    this.onDeleteSubscribers.add(run)
    return () => this.onDeleteSubscribers.delete(run)
  }
}

export class WritableSetStore<T>
  extends ReadableSetStore<T>
  implements Writable<Set<T>>
{
  constructor(value?: Set<T>) {
    super(value)
  }

  public add(item: T) {
    super.add(item)
  }

  public delete(item: T) {
    super.delete(item)
  }

  public set(value: Set<T>) {
    super.set(value)
  }

  public update(updater: Updater<Set<T>>) {
    super.update(updater)
  }
}

export class DerivedSetStore<V, T> extends ReadableSetStore<T> {
  constructor(store: Readable<V>, callback: (value: V) => Set<T>) {
    super()
    store.subscribe((value) => {
      this.set(callback(value))
    })
  }
}

export class DerivedSetCombination<T> extends ReadableSetStore<T> {
  private valueCount = new Map<T, number>()
  private unsubscribers = new Map<ReadableSetStore<T>, Unsubscriber[]>()

  constructor(store: ReadableSetStore<ReadableSetStore<T>>) {
    super()
    store.onAdd((innerStore) => {
      this.unsubscribers.set(innerStore, [
        innerStore.onAdd((value) => this.addToCount(value)),
        innerStore.onDelete((value) => this.removeFromCount(value)),
      ])
    })
    store.onDelete((innerStore) => {
      this.unsubscribers
        .get(innerStore)
        ?.forEach((unsubscriber) => unsubscriber())
      get(innerStore).forEach((value) => this.removeFromCount(value))
    })
  }

  private addToCount(value: T) {
    if (this.valueCount.has(value)) {
      this.valueCount.set(value, (this.valueCount.get(value) ?? 0) + 1)
    } else {
      this.valueCount.set(value, 1)
      this.add(value)
    }
  }

  private removeFromCount(value: T) {
    if (this.valueCount.has(value)) {
      const count = this.valueCount.get(value) ?? 0
      if (count <= 1) {
        this.valueCount.delete(value)
        this.delete(value)
      } else {
        this.valueCount.set(value, count - 1)
      }
    } else console.error("Negative count in DerivedSetCombination!")
  }
}

export class DynamicDerivedSetStore<T, V, R> extends ReadableSetStore<R> {
  constructor(
    valuesStore: Readable<T>,
    transform: (value: T) => Readable<V>[],
    callback: (values: V[]) => Set<R>
  ) {
    super()
    let unsubscribe: Unsubscriber = () => undefined
    valuesStore.subscribe((values) => {
      unsubscribe()

      const stores = transform(values)
      unsubscribe = derived<Readable<V>[], V[]>(
        stores,
        ($values) => $values
      ).subscribe(($values) => {
        this.set(callback($values))
      })
    })
  }
}

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
      unsubscribe = derived<Readable<V>[], V[]>(
        stores,
        ($values) => $values
      ).subscribe(($values) => {
        const value = callback($values)
        if (this.value === undefined || !isEqual(this.value, value)) {
          initialValue = value
          this.value = value
          this.subscribers.forEach((subscriber) => subscriber(this.value))
        }
      })
    })

    // initialise value
    if (initialValue === undefined) {
      throw new Error("subscribe should call callback immediately")
    }
    this.value = initialValue
  }

  subscribe(subscriber: Subscriber<R>): Unsubscriber {
    subscriber(this.value)
    this.subscribers.push(subscriber)
    return () =>
      this.subscribers.splice(this.subscribers.indexOf(subscriber), 1)
  }
}
