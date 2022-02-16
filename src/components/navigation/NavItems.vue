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
        <NavDropdownCategory name="digital electronics">
          <NavDropdownEntry href="/tools/digital-electronics/basics">Basics</NavDropdownEntry>
          <NavDropdownEntry href="/tools/digital-electronics/flip-flops">Flip-flops</NavDropdownEntry>
        </NavDropdownCategory>
      </template>
    </NavItem>
  </div>
</template>