<script lang="ts">
  import { navigating } from "$app/stores"
  import NavElement from "./NavElement.svelte"
  import type { NavigationData } from "./navigation"
  import { navigationData } from "./navigation"

  export let data: NavigationData = navigationData

  let expanded = false
  $: if ($navigating?.from?.url !== $navigating?.to?.url) expanded = false
</script>

<nav>
  <div
    class="icon"
    class:expanded
    on:click={() => (expanded = !expanded)}
    on:keydown={(event) => {
      if (event.key === "Enter") expanded = !expanded
    }}
    tabindex="0"
  >
    <div />
    <div />
    <div />
  </div>
  <div class="wrapper" class:expanded>
    <ul>
      {#each data.elements as elementData}
        <NavElement data={elementData} mobile={true} depth={0} />
      {/each}
    </ul>
  </div>
</nav>

<style lang="scss">
  nav {
    padding-inline: 1em;

    .icon {
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
      &.expanded div {
        &:nth-child(1) {
          transform: translate(0px, 11px) rotate(-45deg);
        }
        &:nth-child(2) {
          opacity: 0;
        }
        &:nth-child(3) {
          transform: translate(0px, -11px) rotate(45deg);
        }
      }
    }

    .wrapper {
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      height: 100vh;
      width: 25rem;
      background-color: #0008;
      overflow-y: scroll;
      transform: translateX(100%);
      transition: transform 0.5s;

      @media (max-width: 30rem) {
        width: 100vw;
      }
      
      &.expanded {
        transform: translateX(0%);
      }

      ul {
        list-style: none;
        padding-left: 1em;
        padding-block: 2.5em;
      }
    }
  }
</style>
