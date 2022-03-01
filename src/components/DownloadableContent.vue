<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { saveAs } from "file-saver"
import { PropType } from "vue"

const props = defineProps({
  filename: {
    required: true,
    type: String,
  },
  downloads: {
    default: [
      {
        fileType: "text/plain",
      },
    ],
    type: Object as PropType<
      Array<{
        label?: string
        fileType: string
        processContent?: (content: string) => string
      }>
    >,
  },
})

const wrapper = ref()

function save(fileType: string, processContent?: (content: string) => string) {
  let content: string = wrapper.value.innerHTML
  content = processContent?.(content) ?? content
  saveAs(
    new Blob([content], {
      type: `${fileType};charset=utf-8`,
    }),
    props.filename
  )
}
</script>

<template>
  <div ref="wrapper">
    <slot />
  </div>
  <div :class="$style.downloads">
    <button
      v-for="download in downloads"
      :class="$style.download"
      @click="save(download.fileType, download.processContent)"
    >
      <Icon icon="mdi-light:download" />
      {{ download.label ?? "Download" }}
    </button>
  </div>
</template>

<style module>
.downloads {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.download {
  display: block;
  margin: 0.25em 0.5em;
  & > svg {
    display: inline;
  }
}
</style>
