<script lang="ts">
  import fileSaver from "file-saver"
  import DownloadIcon from "~icons/mdi/download"

  export let filename: string
  export let downloads: {
    id: number
    label?: string
    fileType: string
    processContent?: (content: string) => string
  }[] = [{ id: 0, fileType: "text/plain" }]

  let wrapper: HTMLDivElement

  function save(
    fileType: string,
    processContent?: (content: string) => string
  ) {
    let content: string = wrapper.innerHTML
    content = processContent?.(content) ?? content
    fileSaver.saveAs(
      new Blob([content], {
        type: `${fileType};charset=utf-8`,
      }),
      filename
    )
  }
</script>

<template>
  <div bind:this={wrapper}>
    <slot />
  </div>
  <div class="downloads">
    {#each downloads as download (download.id)}
      <button
        class="download"
        on:click={() => save(download.fileType, download.processContent)}
      >
        <DownloadIcon />
        {download.label ?? "Download"}
      </button>
    {/each}
  </div>
</template>

<style lang="scss">
  .downloads {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .download {
    display: block;
    margin: 0.25em 0.5em;
    & > :global(svg) {
      display: inline;
    }
  }
</style>
