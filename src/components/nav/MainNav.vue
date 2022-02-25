<script setup lang="ts">
import { OnClickOutside } from "@vueuse/components"
import MainNavItem from "~/components/nav/MainNavItem.vue"
const expanded = ref(false)

watch(useRoute(), () => {
  expanded.value = false
})
</script>

<template>
  <OnClickOutside @trigger="expanded = false">
    <nav>
      <div
        :class="$style.icon"
        :data-expanded="expanded"
        @click="expanded = !expanded"
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul :class="$style.navigation" :data-expanded="expanded">
        <MainNavItem href="/">Home</MainNavItem>
        <MainNavItem href="/maven/" external>Maven</MainNavItem>
        <MainNavItem href="/tools" include-sublinks>Tools</MainNavItem>
      </ul>
    </nav>
  </OnClickOutside>
</template>

<style module>
.icon {
  @media (width < 35em) {
    position: relative;
    display: block;
    cursor: pointer;
    z-index: 2;
    margin: 5px;
    & div {
      width: 35px;
      height: 5px;
      background-color: var(--text-2);
      margin: 6px;
      transition: transform 0.5s, opacity 0.5s;
    }
    &[data-expanded="true"] div {
      &:nth-child(1) {
        transform: translate(0px, 11px) rotate(45deg);
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        transform: translate(0px, -11px) rotate(-45deg);
      }
    }
  }
  @media (width >= 35em) {
    display: none;
  }
}

.navigation {
  display: flex;
  gap: var(--size-3);
  list-style: none;

  @media (width < 35em) {
    position: fixed;
    inset: 0 0 0 30%;
    flex-direction: column;
    padding: min(25vh, 10rem) 2rem;
    background: #0008;
    transform: translateX(100%);
    transition: transform 0.5s;

    &[data-expanded="true"] {
      transform: none;
    }
  }
  @media (width >= 35em) {
    padding: 0.5rem 2rem;
  }
}
</style>
