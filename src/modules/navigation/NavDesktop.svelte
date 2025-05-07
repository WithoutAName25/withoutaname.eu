<script lang="ts">
  import NavElement from "./NavElement.svelte"
  import type { NavigationData } from "./navigation"
  import { navigationData } from "./navigation"

  export let data: NavigationData = navigationData
</script>

<nav>
  <ul>
    {#each data.elements as elementData (elementData.name)}
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
