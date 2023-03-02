import { derived, writable } from "svelte/store"

export default class Cell {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly isMine: boolean,
    readonly numAdjacentMines: number
  ) {}
  readonly isFlagged = writable(false)
  readonly isRevealed = writable(false)
  readonly flaggedCorrectly = derived(
    this.isFlagged,
    ($isFlagged) => $isFlagged === this.isMine
  )
  readonly revealedCorrectly = derived(
    this.isRevealed,
    ($isRevealed) => $isRevealed === !this.isMine
  )
  readonly hasLost = derived(
    this.isRevealed,
    ($isRevealed) => $isRevealed && this.isMine
  )
}
