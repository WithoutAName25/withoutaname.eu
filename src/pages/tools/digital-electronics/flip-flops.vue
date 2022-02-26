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
</script>

<template>
  <FlipFlopSettingsMenu :settings="settings" />
  <div :class="$style.output">
    <div>
      <DownloadableContent type="image/svg+xml" filename="flip-flop.svg">
        <FlipFlopDisplay :flip-flop="flipFlop" />
      </DownloadableContent>
    </div>
    <div v-if="settings.timingDiagram.show">
      <DownloadableContent type="image/svg+xml" filename="flip-flop.svg">
        <FlipFlopHistory :history="history" />
      </DownloadableContent>
    </div>
  </div>
</template>

<style module>
.output {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 30em));
  justify-content: center;

  & div {
    display: grid;
    place-content: center;
  }
}
</style>
