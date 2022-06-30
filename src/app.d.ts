/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface Session {}
  // interface Stuff {}
}

declare module "~icons/*" {
  import { SvelteComponentTyped } from "svelte"
  export default class extends SvelteComponentTyped<
    svelte.JSX.IntrinsicElements["svg"]
  > {}
}
