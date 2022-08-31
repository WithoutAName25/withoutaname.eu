<script lang="ts">
  import DownloadableContent from "../../../../components/DownloadableContent.svelte"
  import FlipFlopDisplay from "./display/FlipFlopDisplay.svelte"
  import { FlipFlop } from "./flip-flop"
  import { FlipFlopSettings } from "./flip-flop-settings"
  import FlipFlopSettingsMenu from "./FlipFlopSettingsMenu.svelte"
  import FlipFlopHistory from "./history/FlipFlopHistory.svelte"

  const settings = new FlipFlopSettings()
  const flipFlop = new FlipFlop(settings)
  const history = flipFlop.history
  const showHistory = settings.history.show

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

<FlipFlopSettingsMenu {settings} />
<div class="output" class:twoItems={$showHistory}>
  <div>
    <DownloadableContent {downloads} filename="flip-flop.svg">
      <FlipFlopDisplay {flipFlop} />
    </DownloadableContent>
  </div>
  {#if $showHistory}
    <div>
      <DownloadableContent {downloads} filename="flip-flop.svg">
        <FlipFlopHistory {history} />
      </DownloadableContent>
    </div>
  {/if}
</div>

<style lang="scss">
  .twoItems {
    @media (min-width: 40em) {
      --columns: 2;
    }
  }

  .output {
    display: grid;
    grid-template-columns: repeat(var(--columns, 1), minmax(1em, 30em));
    justify-content: center;

    > div {
      display: flex;
      flex-direction: column;
      place-items: center;

      > :global(div:first-child) {
        flex-grow: 1;
        display: grid;
        grid-template-columns: 1fr;
        place-content: center;
        width: 100%;
      }
    }
  }
</style>
