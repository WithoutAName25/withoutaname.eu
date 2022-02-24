<script setup lang="ts">
const props = defineProps({
  external: {
    default: false,
    type: Boolean,
  },
  href: String,
  includeSublinks: {
    default: false,
    type: Boolean,
  },
})
const routerLinkActiveSublink = ref(false)

if (props.includeSublinks) {
  const route = useRoute()
  function updateSublink() {
    routerLinkActiveSublink.value = route.path.startsWith(props.href ?? "")
  }
  updateSublink()
  watch(route, () => {
    updateSublink()
  })
}
</script>

<template>
  <li :class="$style.element">
    <a :href="href" v-if="external || !href">
      <slot />
    </a>
    <router-link
      :class="{ 'router-sublink-active': routerLinkActiveSublink }"
      :to="href"
      v-else
    >
      <slot />
    </router-link>
  </li>
</template>

<style module>
.element {
  color: inherit;
  cursor: pointer;
  &:hover {
    color: var(--brand);
  }
  & a {
    color: inherit;
    text-decoration: none;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      display: block;
      background: var(--brand);
      height: 0.1em;
      bottom: 0;
      left: 50%;
      right: 50%;
      transition: left 0.5s, right 0.5s;
    }
    &:global(.router-link-active),
    &:global(.router-sublink-active) {
      &::after {
        left: 0.25em;
        right: 0.25em;
      }
    }
  }
}
</style>
