<script setup lang="ts">
import NavItems from "./NavItems.vue";
import { ref } from "vue";
import NavIconItem from "./NavIconItem.vue";

const isActive = ref(false);
const toggleActive = () => isActive.value = !isActive.value;
</script>

<template>
  <nav>
    <div class="only-portrait navbar">
      <a href="javascript:void(0);" class="icon" :class="{ active: isActive }" @click="toggleActive()"
         aria-label="Menu">
        <div class="bar bar1"></div>
        <div class="bar bar2"></div>
        <div class="bar bar3"></div>
      </a>
      <NavIconItem href="/" label="Home" icon="house"/>
    </div>
    <div class="menu" :class="{ active: isActive }">
      <NavItems/>
    </div>
    <div class="spacer"></div>
    <div class="navbar">
      <NavIconItem href="https://github.com/WithoutAName25/withoutaname.eu" external label="GitHub"
                   :icon="['fab', 'github']"/>
      <NavIconItem @click="$emit('toggleTheme')" label="Change theme" icon="circle-half-stroke"/>
    </div>
  </nav>
</template>

<style scoped lang="scss">
@use "src/assets/mixins";
@use "src/assets/navigation";

nav {
  background-color: var(--color-bg-1);
  display: flex;

  > * {
    flex: 0 0 auto;

    &.spacer {
      flex-grow: 1;
    }
  }
}

@include navigation.navbar {
  .menu {
    display: inline-block;
  }
}

@include navigation.fullscreen {
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

    .items {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: max-content;
      text-align: center;
    }
  }
  .only-portrait > * {
    float: left;
  }
  .icon {
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
      transition: transform .5s, opacity .5s;
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