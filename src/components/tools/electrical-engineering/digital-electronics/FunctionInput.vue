<script setup lang="ts">
import { reactive, ref } from "vue";
import { Circuit } from "../../../../script/tools/electrical-engineering/digital-electronics/circuit";

const inputType = ref("function")
const functionStr = ref("")
const variables = reactive(["A", "B", "C", "D"]);
const circuit = new Circuit(variables, functionStr)
</script>

<template>
  <label>Variables
    <button @click="variables.pop()">-</button>
    <button @click="variables.push(String.fromCharCode(65 + variables.length))">+</button>
    :
    <input v-for="(_, index) in variables" v-model="variables[index]">
  </label><br>
  Input type:
  <label><input v-model="inputType" type="radio" value="function">Function</label>
  <label><input v-model="inputType" type="radio" value="table">Table</label><br>
  <input :readonly="(inputType !== 'function')" v-model="functionStr"><br>
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

</style>