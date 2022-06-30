<script lang="ts">
  import { navigationData } from "./navigation"
  import type { NavigationData } from "./navigation"
  import NavElement from "./NavElement.svelte"

  export let data: NavigationData = navigationData
</script>

<nav>
  <ul>
    {#each data.elements as elementData}
      <NavElement data={elementData} mobile={false} depth={0} />
    {/each}
  </ul>
</nav>

<style lang="scss">
  nav {
    padding-inline: 1em;

    ul {
      list-style: none;
      padding-left: initial;
      display: flex;
    }
  }
</style>
