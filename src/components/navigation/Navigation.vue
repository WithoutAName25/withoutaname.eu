<script setup lang="ts">
import NavItems from "./NavItems.vue";
import { ref } from "vue";

const isActive = ref(false);
const toggleActive = () => isActive.value = !isActive.value;
</script>

<template>
  <nav>
    <div class="menu" :class="{ active: isActive}">
      <NavItems/>
    </div>
    <a class="icon" :class="{ active: isActive}" @click="toggleActive()">
      <div class="bar bar1"></div>
      <div class="bar bar2"></div>
      <div class="bar bar3"></div>
    </a>
  </nav>
</template>

<style scoped lang="scss">
nav {
  background-color: #333;
  overflow: hidden;
}

@media screen and (orientation: landscape) {
  .items :deep(a) {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;

    &:hover {
      background-color: #ddd;
      color: black;
    }

    &.router-link-active {
      background-color: #0088ff;
      color: white;
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
    background-color: rgba(0, 0, 0, 0.9);
    overflow-x: hidden;
    transition: 0.5s;

    &.active {
      width: 100%;
    }

    :deep(a) {
      padding: 8px;
      text-decoration: none;
      font-size: 36px;
      color: #f2f2f2;
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
    position: relative;
    display: inline-block;
    cursor: pointer;
    z-index: 2;
    margin: 5px;

    .bar {
      width: 35px;
      height: 5px;
      background-color: #f2f2f2;
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