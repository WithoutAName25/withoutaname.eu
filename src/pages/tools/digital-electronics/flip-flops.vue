<script setup lang="ts">
import DownloadableContent from "~/components/DownloadableContent.vue"
import FlipFlopDisplay from "~/components/tools/digital-electronics/flip-flop/FlipFlopDisplay.vue"
import FlipFlopHistory from "~/components/tools/digital-electronics/flip-flop/FlipFlopHistory.vue"
import FlipFlopSettingsMenu from "~/components/tools/digital-electronics/flip-flop/FlipFlopSettingsMenu.vue"
import { FlipFlop } from "~/scripts/tools/digital-electronics/flip-flop"
import { FlipFlopSettings } from "~/scripts/tools/digital-electronics/flip-flop-settings"

const settings = new FlipFlopSettings()
const flipFlop = new FlipFlop(settings)
const history = flipFlop.history

const downloads: Array<{
  label?: string
  fileType: string
  processContent?: (content: string) => string
}> = [
  {
    label: "Download (dark)",
    fileType: "image/svg+xml",
    processContent: (content) =>
      content
        .replaceAll('data-color-fill=""', 'fill="black"')
        .replaceAll('data-color-stroke=""', 'stroke="black"')
        .replaceAll('data-color-stroke-low-contrast=""', 'stroke="#bbb"'),
  },
  {
    label: "Download (light)",
    fileType: "image/svg+xml",
    processContent: (content) =>
      content
        .replaceAll('data-color-fill=""', 'fill="white"')
        .replaceAll('data-color-stroke=""', 'stroke="white"')
        .replaceAll('data-color-stroke-low-contrast=""', 'stroke="#555"'),
  },
]
</script>

<template>
  <FlipFlopSettingsMenu :settings="settings" />
  <div
    :class="{
      [$style.output]: true,
      [$style.twoItems]: settings.timingDiagram.show,
    }"
  >
    <div>
      <DownloadableContent :downloads="downloads" filename="flip-flop.svg">
        <FlipFlopDisplay :flip-flop="flipFlop" />
      </DownloadableContent>
    </div>
    <div v-if="settings.timingDiagram.show">
      <DownloadableContent :downloads="downloads" filename="flip-flop.svg">
        <FlipFlopHistory :history="history" />
      </DownloadableContent>
    </div>
  </div>
</template>

<style module>
.twoItems {
  @media (min-width: 40em) {
    --columns: 2;
  }
}

.output {
  display: grid;
  grid-template-columns: repeat(var(--columns, 1), minmax(1em, 30em));
  justify-content: center;

  & > div {
    display: flex;
    flex-direction: column;
    place-items: center;

    & > div:first-child {
      flex-grow: 1;
      display: grid;
      grid-template-columns: 1fr;
      place-content: center;
      width: 100%;
    }
  }
}
</style>
