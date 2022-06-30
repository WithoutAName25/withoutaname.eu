<script lang="ts">
  import { fade } from "svelte/transition"
  import type { NavElementData } from "./navigation"
  import NavElement from "./NavElement.svelte"

  export let data: NavElementData[]
  export let depth: number
  export let mobile: boolean
  export let inline: boolean
  export let visible: boolean
</script>

{#if inline || visible}
  <ul
    transition:fade={{ duration: 250 }}
    class:inline
    class:noInline={!inline}
    class:hide={inline && !visible}
  >
    {#each data as elementData}
      <NavElement data={elementData} {depth} {mobile} />
    {/each}
  </ul>
{/if}

<style lang="scss">
  ul {
    list-style: none;

    &.hide {
      display: none;
    }

    &.inline {
      position: relative;
      padding-left: 0.5em;
      &::before {
        content: "";
        position: absolute;
        display: block;
        width: 0.2rem;
        left: 0.5em;
        inset-block: 0.5em;
        border-radius: 0.1rem;
        background-color: var(--brand);
      }
    }

    &.noInline {
      position: absolute;
      top: 100%;
      width: 7.5em;
      padding: 0.5em;
      background-color: var(--surface-3);
      box-shadow: var(--shadow-2);
      border-radius: var(--radius-2);
    }
  }
</style>
