<script lang="ts">
  import { browser } from "$app/env"
  import HomeIcon from "~icons/mdi/home"
  import NavDesktop from "../modules/navigation/NavDesktop.svelte"
  import NavMobile from "../modules/navigation/NavMobile.svelte"

  let mobile = false
  if (browser) {
    let mediaQueryList = window.matchMedia(
      "(orientation: portrait) or (max-width: 40rem)"
    )
    mobile = mediaQueryList.matches
    mediaQueryList.onchange = (event) => {
      mobile = event.matches
    }
  }
</script>

<header>
  <div class="left">
    {#if mobile}
      <a class="home" href="/">
        <HomeIcon />
      </a>
    {:else}
      <NavDesktop />
    {/if}
  </div>
  <div class="right">
    {#if mobile}
      <NavMobile />
    {/if}
  </div>
</header>

<style lang="scss">
  header {
    position: sticky;
    top: 0;
    background-color: var(--surface-2);
    box-shadow: var(--shadow-2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--font-size-3);
    height: var(--size-9);

    div {
      display: flex;
      align-items: center;

      a {
        color: inherit;

        &.home > :global(.icon) {
          box-sizing: content-box;
          padding-inline: 0.5em;
          font-size: 1.5em;
        }
      }
    }
  }
</style>
