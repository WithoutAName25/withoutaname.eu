<script lang="ts">
  import { navigating, page } from "$app/state"
  import ExternalIcon from "~icons/lucide/external-link"
  import DropdownIcon from "~icons/mdi/menu-down"
  import { onClickOrEnterOutside } from "../../scripts/onClickOutside"
  import NavDropdown from "./NavDropdown.svelte"
  import type { NavElementData } from "./navigation"
  import { NavGroupData } from "./navigation"

  let {
    data,
    depth,
    mobile,
  }: { data: NavElementData; depth: number; mobile: boolean } = $props()

  const subElements = $derived(
    data instanceof NavGroupData ? data.elements : undefined,
  )
  const activeExact = $derived(page.url.pathname === data.url)
  const active = $derived(
    data instanceof NavGroupData
      ? page.url.pathname.startsWith(data.baseUrl)
      : activeExact,
  )

  let hover = $state(false)
  let clicked = $state(false)
  $effect(() => {
    if (navigating.from?.url !== navigating.to?.url) clicked = false
  })

  const inline = $derived(mobile || depth > 0)
  const showDropdown = $derived(clicked || (hover && !inline))
</script>

<svelte:body
  onkeydown={(event) => {
    if (event.key === "Escape") clicked = false
  }}
/>
<li
  onmouseenter={() => (hover = true)}
  onmouseleave={() => (hover = false)}
  use:onClickOrEnterOutside={() => (clicked = false)}
>
  <a
    href={data.url}
    class:active={activeExact || (active && !showDropdown)}
    onclick={() => (clicked = !clicked)}
    onkeydown={(event) => {
      if (event.key === "Enter") clicked = !clicked
    }}
    tabindex="0"
  >
    {data.name}{#if subElements}<DropdownIcon
        class="{showDropdown ? '' : 'rotate'} icon"
      />{/if}
    {#if data.url?.startsWith("http")}<ExternalIcon />{/if}
  </a>
  {#if subElements}
    <NavDropdown
      data={subElements}
      depth={depth + 1}
      {mobile}
      {inline}
      visible={showDropdown}
    />
  {/if}
</li>

<style lang="scss">
  li {
    position: relative;
    padding-block: 0.25em;
    a {
      position: relative;
      display: inline-block;
      padding-inline: 0.5em;
      padding-block: 0.1em;
      text-decoration: none;
      color: inherit;
      cursor: pointer;

      &:hover {
        color: var(--brand);
      }
      &::after {
        content: "";
        position: absolute;
        top: 100%;
        inset-inline: 50%;
        height: 0.1rem;
        border-radius: 0.05rem;
        background-color: var(--brand);
        transition: inset-inline 0.25s ease-in-out;
      }
      &:is(:hover, .active)::after {
        inset-inline: 0.5em;
      }

      > :global(.icon) {
        transition: transform 0.25s ease-in-out;
      }
      > :global(.icon.rotate) {
        transform: rotate(90deg);
      }
    }
  }
</style>
