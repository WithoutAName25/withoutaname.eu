<script setup lang="ts">
import NavItem from "./NavItem.vue"
import NavDropdownCategory from "./NavDropdownCategory.vue";
import NavDropdownEntry from "./NavDropdownEntry.vue";</script>

<template>
  <div class="items">
    <NavItem href="/">Home</NavItem>
    <NavItem href="/maven/" external>Maven</NavItem>
    <NavItem>
      Tools
      <template #dropdown>
        <NavDropdownCategory name="electrical engineering">
          <NavDropdownEntry href="/tools/digital-electronics">digital electronics</NavDropdownEntry>
        </NavDropdownCategory>
      </template>
    </NavItem>
  </div>
</template>