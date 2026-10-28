<script lang="ts">
  import { browser } from '$app/env';
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import NProgress from "nprogress";
  import Header from "../components/Header.svelte";
  import "../css/main.pcss";

  let preferredColorScheme = "dark"

  if (browser) {
    beforeNavigate(({ shallow, type }) => {
      if (shallow && type === 'goto') return;

      NProgress.start();
    });

    afterNavigate(({ shallow, type }) => {
      if (shallow && type === 'goto') return;

      NProgress.done();
    });

    preferredColorScheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
</script>

<div
  class="wrapper"
  data-color-scheme={preferredColorScheme}
><Header /><main><slot></slot></main></div>

<style lang="scss">
  .wrapper {
    background-color: var(--surface-1);
    color: var(--text-1);
    min-height: 100vh;

    main {
      padding-block: var(--size-2);
      padding-inline: var(--size-4);
    }
  }
</style>
