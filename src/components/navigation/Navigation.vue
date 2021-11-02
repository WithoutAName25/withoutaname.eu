<script setup lang="ts">
import NavItems from "./NavItems.vue";
import { ref } from "vue";
import FAIcon from "../FAIcon.vue";
import NavItem from "./NavItem.vue";

const isActive = ref(false);
const toggleActive = () => isActive.value = !isActive.value;
</script>

<template>
  <nav>
    <a class="icon only-portrait" :class="{ active: isActive }" @click="toggleActive()">
      <div class="bar bar1"></div>
      <div class="bar bar2"></div>
      <div class="bar bar3"></div>
    </a>
    <div class="shortcuts only-portrait">
      <NavItem href="/"><FAIcon name="house"/></NavItem>
    </div>
    <div class="menu" :class="{ active: isActive }">
      <NavItems/>
    </div>
    <div class="shortcuts-right">
      <a @click="this.$emit('toggleTheme')"><FAIcon name="circle-half-stroke"/></a>
    </div>
  </nav>
</template>

<style scoped lang="scss">
nav {
  background-color: var(--color-bg-1);
  overflow: hidden;
}

@mixin links {
  float: left;
  display: block;
  color: var(--color-text);
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;

  &:hover {
    background-color: var(--color-bg-sel);
    color: var(--color-text-sel);
  }
}

.shortcuts a {
  @include links;
}

.shortcuts-right a {
  @include links;
  float: right;
}

@media screen and (orientation: landscape) {
  .items :deep(a) {
    @include links;

    &.router-link-active {
      background-color: var(--color-accent);
      color: var(--color-text);
    }
  }

  .icon {
    display: none;
  }
}

@media screen and (orientation: portrait) {
  .menu {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    background-color: #000;
    background-color: rgba(0, 0, 0, 0.8);
    overflow-x: hidden;
    transition: 0.5s;

    &.active {
      width: 100%;
    }

    :deep(a) {
      padding: 8px;
      text-decoration: none;
      font-size: 36px;
      color: var(--color-text-light);
      display: block;
    }

    .items {
      position: relative;
      top: 50%;
      transform: translate(0, -50%);
      width: 100%;
      text-align: center;
    }
  }

  .icon {
    float: left;
    position: relative;
    display: block;
    cursor: pointer;
    z-index: 2;
    margin: 5px;

    .bar {
      width: 35px;
      height: 5px;
      background-color: var(--color-text);
      margin: 6px;
      transition: 0.5s;
    }

    &.active {
      .bar1 {
        transform: translate(0px, 11px) rotate(-45deg);
      }

      .bar2 {
        opacity: 0;
      }

      .bar3 {
        transform: translate(0px, -11px) rotate(45deg);
      }
    }
  }
}
</style>