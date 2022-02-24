<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { saveAs } from "file-saver"

const props = defineProps({
  filename: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
})

const wrapper = ref()

function download() {
  saveAs(
    new Blob([wrapper.value.innerHTML], {
      type: `text/${props.type};charset=utf-8`,
    }),
    props.filename
  )
}
</script>

<template>
  <div :class="$style.wrapper" ref="wrapper">
    <slot />
  </div>
  <button :class="$style.download" @click="download()">
    <Icon icon="mdi-light:download" />
    Download
  </button>
</template>

<style module>
.wrapper {
  width: fit-content;
}
.download {
  display: block;
  margin-inline: auto;
  & > svg {
    display: inline;
  }
}
</style>
