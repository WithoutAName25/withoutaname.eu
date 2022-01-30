<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
    external: {
        default: false,
        type: Boolean
    },
    href: String
});
const dropdownActive = ref(false)

function toggleActive() {
    if (!props.href) {
        dropdownActive.value = !dropdownActive.value
    }
}
</script>

<template>
  <div class="item">
    <a :href="href" @click="toggleActive" v-if="external || !href">
      <slot/>
      <FontAwesomeIcon icon="caret-down" v-if="$slots.dropdown"/>
    </a>
    <router-link :to="href" @click="toggleActive" v-else>
      <slot/>
      <FontAwesomeIcon icon="caret-down" v-if="$slots.dropdown"/>
    </router-link>
    <div class="dropdown-content" :class="{active: dropdownActive}" v-if="$slots.dropdown">
      <slot name="dropdown"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "src/assets/mixins";
@use "src/assets/navigation";


@include navigation.fullscreen {
  .item {
    a {
      padding: 10px 30px;
      text-decoration: none;
      font-size: 36px;
      color: var(--color-text-light);
      display: block;
      border-radius: 5px;
    }

    .dropdown-content {
      min-width: 10rem;
      border-radius: 3px;
      display: none;

      &.active {
        display: block;
      }
    }
  }
}

@include navigation.navbar {
  .item {
    display: inline-block;
    background: var(--color-bg-1);

    .dropdown-content {
      position: absolute;
      background-color: var(--color-bg-1);
      min-width: 10rem;
      border-radius: 3px;
      display: none;

      &.active {
        display: block;
      }
    }

    @include mixins.hover {
      .dropdown-content {
        display: block;
      }
    }

    a {
      display: inline-block;
      color: var(--color-text);
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      font-size: 17px;
      border: none;
      border-radius: 3px;
      transition: background-color .5s;

      &.router-link-active {
        background-color: var(--color-bg-4);
      }

      @include mixins.hover {
        background-color: var(--color-bg-3);
      }
    }
  }
}
</style>