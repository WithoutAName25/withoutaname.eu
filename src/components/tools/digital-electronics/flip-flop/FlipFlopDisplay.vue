<script setup lang="ts">
import { FlipFlop } from "~/scripts/tools/digital-electronics/flip-flop"
import { Pos } from "~/scripts/tools/digital-electronics/flip-flop-pins"
import { ClockControl } from "~/scripts/tools/digital-electronics/flip-flop-settings"

const props = defineProps({
  flipFlop: {
    required: true,
    type: FlipFlop,
  },
})
const x = 25
const y = 25
const sizeX = 50
const sizeY = 50

function getX(pos: Pos, i: number, offsetX: number, offsetY: number): number {
  if (pos === "left" || pos === "right") {
    return pos === "left" ? x - offsetX : x + sizeX + offsetX
  } else {
    return (
      x +
      (sizeX * (i + 1)) /
        ((props.flipFlop.pins.get(pos)?.value?.length ?? 3) + 1) +
      (pos === "top" ? offsetY : -offsetY)
    )
  }
}
function getY(pos: Pos, i: number, offsetX: number, offsetY: number): number {
  if (pos === "top" || pos === "bottom") {
    return pos === "top" ? y - offsetX : y + sizeY + offsetX
  } else {
    return (
      y +
      (sizeY * (i + 1)) /
        ((props.flipFlop.pins.get(pos)?.value?.length ?? 3) + 1) +
      (pos === "left" ? -offsetY : offsetY)
    )
  }
}

function isEdgeControlSymbol(name: String): boolean {
  return (
    name === "C" &&
    (props.flipFlop.settings.clockControl.value === ClockControl.EDGE ||
      props.flipFlop.settings.clockControl.value === ClockControl.DUAL_EDGE)
  )
}

function isMasterSlaveSymbol(name: String): boolean {
  return (
    (name === "Q" || name === "Q'") &&
    (props.flipFlop.settings.clockControl.value === ClockControl.DUAL_STATE ||
      props.flipFlop.settings.clockControl.value === ClockControl.DUAL_EDGE)
  )
}
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="$style.svg"
    viewBox="0 0 100 100"
    fill="none"
    data-color-stroke=""
    font-family="system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif"
    font-size="10"
    aria-label="Flip-flop display"
  >
    <g v-for="[pos, pins] in flipFlop.pins">
      <g v-for="(pin, i) in pins.value">
        <line
          :x1="getX(pos, i, pin.name.endsWith('\'') ? 5 : 0, 0)"
          :y1="getY(pos, i, pin.name.endsWith('\'') ? 5 : 0, 0)"
          :x2="getX(pos, i, 10, 0)"
          :y2="getY(pos, i, 10, 0)"
          :stroke="pin.ref.value ? 'red' : undefined"
          :class="{ active: pin.ref.value }"
        />
        <circle
          v-if="pin.name.endsWith('\'')"
          r="2"
          :cx="getX(pos, i, 3, 0)"
          :cy="getY(pos, i, 3, 0)"
          :stroke="pin.ref.value ? 'red' : undefined"
          :class="{ active: pin.ref.value }"
        />
        <polyline
          v-if="isEdgeControlSymbol(pin.name)"
          :points="`${getX(pos, i, 0, -2.5)},${getY(pos, i, 0, -2.5)} ${getX(
            pos,
            i,
            -5,
            0
          )},${getY(pos, i, -5, 0)} ${getX(pos, i, 0, 2.5)},${getY(
            pos,
            i,

            0,
            2.5
          )} `"
        />
        <polyline
          v-if="isMasterSlaveSymbol(pin.name)"
          :points="`${getX(pos, i, -6, -2)},${getY(pos, i, -6, -2)} ${getX(
            pos,
            i,
            -2,
            -2
          )},${getY(pos, i, -2, -2)} ${getX(pos, i, -2, 2)},${getY(
            pos,
            i,

            -2,
            2
          )} `"
        />

        <g data-color-fill="" stroke="none">
          <text
            :x="
              getX(
                pos,
                i,
                isEdgeControlSymbol(pin.name) || isMasterSlaveSymbol(pin.name)
                  ? -11
                  : -6,
                0
              ) - 1
            "
            :y="
              getY(
                pos,
                i,
                isEdgeControlSymbol(pin.name) || isMasterSlaveSymbol(pin.name)
                  ? -11
                  : -6,
                0
              ) + 1
            "
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ pin.name }}
          </text>
          <text
            :x="getX(pos, i, 15, 0)"
            :y="getY(pos, i, 15, 0) + 0.5"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="7.5"
            :fill="pin.ref.value ? 'red' : undefined"
            :class="{ active: pin.ref.value }"
          >
            {{ pin.ref.value ? "1" : "0" }}
          </text>
        </g>
        <rect
          @click="pin.isInput ? (pin.ref.value = !pin.ref.value) : undefined"
          :x="getX(pos, i, 15, 0) - 5"
          :y="getY(pos, i, 15, 0) - 5"
          width="10"
          height="10"
          :stroke="pin.ref.value ? 'red' : undefined"
          :class="{ active: pin.ref.value, [$style.clickable]: pin.isInput }"
        ></rect>
      </g>
    </g>
    <rect :x="x" :y="y" :width="sizeX" :height="sizeY" />
  </svg>
</template>

<style module>
.clickable {
  cursor: pointer;
}
.svg {
  & * {
    fill: transparent;
    stroke: var(--text-2);
    &:global(.active) {
      stroke: red;
    }
  }
  & text {
    fill: var(--text-2);
    stroke: none;
    &:global(.active) {
      stroke: none;
      fill: red;
    }
  }
}
</style>
