<script lang="ts">
  import type { FlipFlopSettings } from "./flip-flop-settings"
  import { ClockControl, FlipFlopType } from "./flip-flop-settings.js"

  export let settings: FlipFlopSettings

  const {
    clockControl,
    dualControlled,
    flipFlopType,
    nonEdgeClockControlAllowed,
    preClearAllowed,
    withClr,
    withPre,
  } = settings
  const {
    length: historyLength,
    show: historyShow,
    showQMaster: historyShowQMaster,
    showQNot: historyShowQNot,
  } = settings.history
</script>

<fieldset class="settings">
  <legend>Settings</legend>
  <div>
    Flip-flop type:
    <ul>
      {#each Object.values(FlipFlopType) as type (type)}
        <li>
          <label>
            <input type="radio" value={type} bind:group={$flipFlopType} />
            {type.toUpperCase()}-flip-flop
          </label>
        </li>
      {/each}
    </ul>
  </div>
  <div>
    Clock control:
    <ul>
      {#each Object.values(ClockControl) as type (type)}
        <li
          class:disabled={type !== ClockControl.EDGE &&
            type !== ClockControl.DUAL_EDGE &&
            !$nonEdgeClockControlAllowed}
        >
          <label>
            <input
              type="radio"
              value={type}
              bind:group={$clockControl}
              disabled={type !== ClockControl.EDGE &&
                type !== ClockControl.DUAL_EDGE &&
                !$nonEdgeClockControlAllowed}
            />
            {type === ClockControl.NONE
              ? "None"
              : type === ClockControl.STATE
              ? "State controlled"
              : type === ClockControl.EDGE
              ? "Edge-triggered"
              : type === ClockControl.DUAL_STATE
              ? "Master-slave state controlled"
              : type === ClockControl.DUAL_EDGE
              ? "Master-slave edge-triggered"
              : "Unknown"}
          </label>
        </li>
      {/each}
    </ul>
  </div>
  <div>
    Asynchronous inputs:
    <ul class:disabled={!$preClearAllowed}>
      <li>
        <label>
          <input
            type="checkbox"
            bind:checked={$withPre}
            disabled={!$preClearAllowed}
          />
          Preset
        </label>
      </li>
      <li>
        <label>
          <input
            type="checkbox"
            bind:checked={$withClr}
            disabled={!$preClearAllowed}
          />
          Clear
        </label>
      </li>
    </ul>
  </div>
  <div>
    Timing diagram:
    <ul>
      <li>
        <label>
          <input type="checkbox" bind:checked={$historyShow} />
          Show
        </label>
      </li>
      <li class:disabled={!$historyShow}>
        Length:
        <button
          on:click={() => $historyLength--}
          class:disabled={!$historyShow}
        >
          -
        </button>
        {$historyLength}
        <button
          on:click={() => $historyLength++}
          class:disabled={!$historyShow}
        >
          +
        </button>
      </li>
      <li class:disabled={!($historyShow && $dualControlled)}>
        <label>
          <input
            type="checkbox"
            disabled={!($historyShow && $dualControlled)}
            bind:checked={$historyShowQMaster}
          />
          Show Qm / Q-master
        </label>
      </li>
      <li class:disabled={!$historyShow}>
        <label>
          <input
            type="checkbox"
            class:disabled={!$historyShow}
            bind:checked={$historyShowQNot}
          />
          Show Q'
        </label>
      </li>
    </ul>
  </div>
</fieldset>

<style lang="scss">
  .settings {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
    border-radius: var(--radius-2);
    border: var(--border-size-1) solid var(--surface-4);

    label {
      cursor: pointer;
      input {
        cursor: inherit;
      }
    }

    ul {
      padding-left: 1em;
      list-style: none;
    }
  }

  .disabled {
    color: var(--gray-6);
    label,
    button {
      cursor: default;
    }
  }
</style>
