<script setup lang="ts">
import { reactive, ref } from "vue";
import { Circuit } from "../../../script/tools/digital-electronics/basics/circuit";

const inputType = ref("function")
const functionStr = ref("A&B|!(C&D)")
const variables = reactive(["A", "B", "C", "D"]);
const circuit = new Circuit(variables, functionStr)
</script>

<template>
  <p>
    <label>Variables:
      <button @click="variables.pop()">-</button>
      <button @click="variables.push(String.fromCharCode(65 + variables.length))">+</button>
      <input class="variables" v-for="(_, index) in variables" v-model="variables[index]">
    </label>
  </p>
  <p>
    Input type:
    <label><input v-model="inputType" type="radio" value="function">Function</label>
    <label><input v-model="inputType" type="radio" value="table">Table</label><br>
  </p>
  <p>
    <label>
      Function:
      <input :readonly="(inputType !== 'function')" v-model="functionStr">
    </label>
  </p>
  <table>
    <tr>
      <th v-for="variableName in variables.slice().reverse()">{{ variableName }}</th>
      <th>X</th>
    </tr>
    <tr v-for="possibleInput in circuit.getPossibleInputs()">
      <td v-for="value in possibleInput.slice().reverse()">{{ value ? "1" : "0" }}</td>
      <td>{{ circuit.getValue(possibleInput) ? "1" : "0" }}</td>
    </tr>
  </table>
</template>

<style scoped lang="scss">
button {
  color: var(--color-text);
  background: var(--color-bg-1);
  border: solid 1px var(--color-text-1);
  border-radius: 4px;
  margin: 0 2px;
}

input {
  outline: none;
  border: none;
  background: transparent;
  transition: border linear .5s;
  color: inherit;

  &:read-write {
    border-bottom: solid 2px var(--color-text-1);

    &:focus {
      border-bottom-color: var(--color-accent);
    }
  }

  &.variables {
    width: 3.5em;
    margin: 0 3px;
  }
}
</style>