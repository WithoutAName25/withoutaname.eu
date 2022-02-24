<script setup lang="ts">
import { FlipFlop } from "~/scripts/tools/digital-electronics/flip-flop"
import { FlipFlopSettings } from "~/scripts/tools/digital-electronics/flip-flop-settings"

const settings = new FlipFlopSettings()
const flipFlop = new FlipFlop(settings)
</script>

<template>
  <FlipFlopSettingsMenu :settings="settings" />
  <div :class="$style.output">
    <div>
      <DownloadableContent type="image/svg+xml" filename="flip-flop.svg">
        <FlipFlopDisplay :flip-flop="flipFlop" />
      </DownloadableContent>
    </div>
  </div>
</template>

<style module>
.output {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 500px));
  justify-content: center;
}
</style>
