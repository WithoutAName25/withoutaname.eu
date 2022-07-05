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
