<script setup lang="ts">
import { PropType } from "vue"
import { historyLength } from "~/scripts/tools/digital-electronics/flip-flop-history"
import {
  ClockControl,
  FlipFlopSettings,
  FlipFlopType,
} from "~/scripts/tools/digital-electronics/flip-flop-settings"

defineProps({
  settings: {
    type: Object as PropType<FlipFlopSettings>,
    required: true,
  },
})
const { t } = useI18n()
</script>

<template>
  <fieldset :class="$style.settings">
    <legend>{{ t("flipFlop.settings") }}</legend>
    <div>
      {{ t("flipFlop.type") }}:
      <ul>
        <li v-for="type in FlipFlopType">
          <label>
            <input
              type="radio"
              v-model="settings.flipFlopType.value"
              :value="type"
            />
            {{ t(`flipFlop.types.${type}`) }}
          </label>
        </li>
      </ul>
    </div>
    <div>
      {{ t("flipFlop.clockControl") }}:
      <ul>
        <li v-for="type in ClockControl">
          <label>
            <input
              type="radio"
              v-model="settings.clockControl.value"
              :value="type"
              :disabled="
                type !== ClockControl.EDGE &&
                type !== ClockControl.DUAL_EDGE &&
                !settings.nonEdgeClockControlAllowed.value
              "
            />
            {{ t(`flipFlop.clockControls.${type}`) }}
          </label>
        </li>
      </ul>
    </div>
    <div>
      {{ t("flipFlop.asyncInputs") }}:
      <ul :class="{ [$style.disabled]: !settings.preClearAllowed.value }">
        <li>
          <label>
            <input
              type="checkbox"
              :disabled="!settings.preClearAllowed.value"
              v-model="settings.withPre.value"
            />
            Preset
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              :disabled="!settings.preClearAllowed.value"
              v-model="settings.withClr.value"
            />
            Clear
          </label>
        </li>
      </ul>
      {{ t("flipFlop.history.name") }}:
      <ul>
        <li>
          <label>
            <input type="checkbox" v-model="settings.showHistory.value" />
            {{ t("flipFlop.history.enabled") }}
          </label>
        </li>
        <li>
          {{ t("flipFlop.history.length") }}:
          <button @click="historyLength--">-</button>
          {{ historyLength }}
          <button @click="historyLength++">+</button>
        </li>
      </ul>
    </div>
  </fieldset>
</template>

<style module>
.settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12.5em, 1fr));

  & label {
    cursor: pointer;
    & input {
      cursor: inherit;
    }
  }

  & ul {
    padding-left: 1em;
    list-style: none;
  }
}
.disabled label {
  cursor: default;
  color: var(--gray-6);
}
</style>

<i18n lang="yaml">
en:
  flipFlop:
    asyncInputs: "Asynchronous inputs"
    clockControl: "Clock control"
    clockControls:
      none: "None"
      state: "State controlled"
      edge: "Edge-triggered"
      dual_state: "Master-slave state controlled"
      dual_edge: "Master-slave edge-triggered"
    history:
      name: "Timing diagram"
      enabled: "Show"
      length: "Length"
    settings: "Settings"
    type: "Flip-flop type"
    types:
      rs: "RS-flip-flop"
      d: "D-flip-flop"
      jk: "JK-flip-flop"
      t: "T-flip-flop"
de:
  flipFlop:
    asyncInputs: "Asynchrone Eingänge"
    clockControl: "Taktsteuerung"
    clockControls:
      none: "Ohne"
      state: "Einzustandsgesteuert"
      edge: "Einflankengesteuert"
      dual_state: "Zweizustandsgesteuert"
      dual_edge: "Zweiflankengesteuert"
    history:
      name: "Zeitablaufdiagramm"
      enabled: "Anzeigen"
      length: "Länge"
    settings: "Einstellungen"
    type: "Flip-Flop-Typ"
    types:
      rs: "RS-Flip-Flop"
      d: "D-Flip-Flop"
      jk: "JK-Flip-Flop"
      t: "T-Flip-Flop"
</i18n>
