export function isSetEqual<T>(
  oldValue: ReadonlySet<T>,
  newValue: ReadonlySet<T>
) {
  for (const value of oldValue) {
    if (!newValue.has(value)) {
      return false
    }
  }
  for (const value of newValue) {
    if (!oldValue.has(value)) {
      return false
    }
  }
  return true
}

export function applyToAllCombinations<T>(
  array: T[],
  k: number,
  callback: (value: T[]) => void
) {
  internalApplyToAllCombinations(array, k, callback, [], 0)
}

function internalApplyToAllCombinations<T>(
  array: T[],
  k: number,
  callback: (value: T[]) => void,
  selected: T[],
  startIndex: number
) {
  if (selected.length === k) {
    callback(selected)
    return
  }

  for (let i = startIndex; i <= array.length - k + selected.length; i++) {
    internalApplyToAllCombinations(
      array,
      k,
      callback,
      [...selected, array[i]],
      i + 1
    )
  }
}
