<script lang="ts">
  import HomeIcon from "~icons/mdi/home"
  import NavDesktop from "../modules/navigation/NavDesktop.svelte"
  import NavMobile from "../modules/navigation/NavMobile.svelte"
</script>

<header>
  <div class="desktop">
    <NavDesktop />
  </div>
  <div class="mobile">
    <a class="home" href="/">
      <HomeIcon />
    </a>
  </div>
  <div class="mobile">
    <NavMobile />
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

    > div {
      &.desktop {
        display: block;
      }

      &.mobile {
        display: none;
      }

      @media (orientation: portrait) or (max-width: 40rem) {
        &.desktop {
          display: none;
        }

        &.mobile {
          display: block;
        }
      }
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
