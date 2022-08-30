<script lang="ts">
  import type { SudokuField } from "./field"

  export let field: SudokuField

  const value = field.value
  const possibleValues = field.possibleValues
  $: possibleValuesString = [...$possibleValues].join("")

  function onInput(event: Event) {
    console.time("onInput")
    const input = event.target as HTMLInputElement
    if (field.allowedValues.has(input.value)) {
      $value = undefined
      $value = input.value
    } else if (field.allowedValues.has(input.value[input.value.length - 1])) {
      $value = undefined
      $value = input.value[input.value.length - 1]
    } else if (input.value === "") {
      $value = undefined
    }
    input.value = $value ?? ""
    console.timeEnd("onInput")
  }
</script>

<div>
  <input
    type="text"
    class:active={$value !== undefined}
    value={$value ?? ""}
    placeholder={possibleValuesString}
    on:input={onInput}
  />
</div>

<style lang="scss">
  div {
    border: solid 1px var(--text-2);
    display: grid;
  }

  input {
    border: none;
    width: 100%;
    text-align: center;
    height: 100%;
    display: inline-grid;
    background-color: transparent;

    &.active {
      font-size: 3em;
    }
  }

  input:focus {
    outline: none;
  }
</style>
