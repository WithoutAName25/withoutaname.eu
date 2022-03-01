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

function save(id: number) {
  let content: string = wrapper.value.innerHTML
  content = props.downloads[id].processContent?.(content) ?? content
  saveAs(
    new Blob([content], {
      type: `${props.downloads[id].fileType};charset=utf-8`,
    }),
    props.filename
  )
}
</script>

<template>
  <slot />
  <div :class="$style.downloads">
    <button
      v-for="(download, i) in downloads"
      :class="$style.download"
      @click="save(i)"
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
