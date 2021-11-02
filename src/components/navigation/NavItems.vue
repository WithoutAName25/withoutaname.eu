<script setup lang="ts">
import NavItem from "./NavItem.vue"
import FAIcon from "../FAIcon.vue";
</script>

<template>
  <div class="items">
    <NavItem href="/"><FAIcon name="home"/> Home</NavItem>
    <NavItem href="/maven/" external>Maven</NavItem>
  </div>
</template>