<script lang="ts">
  import type { SudokuField } from "./field"

  export let field: SudokuField

  const value = field.value
  const possibleValues = field.possibleValues
  $: possibleValuesString = [...$possibleValues].join("")

  function onInput(event: Event) {
    const input = event.target as HTMLInputElement
    if (field.allowedValues.has(input.value)) {
      $value = input.value
    } else if (field.allowedValues.has(input.value[input.value.length - 1])) {
      $value = input.value[input.value.length - 1]
    } else if (input.value === "") {
      $value = undefined
    }
    input.value = $value ?? ""
  }
</script>

<div>
  <input
    type="text"
    value={$value ?? ""}
    placeholder={possibleValuesString}
    on:input={onInput}
  />
</div>
