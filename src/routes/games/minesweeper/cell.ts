import { derived, get, writable } from "svelte/store"

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

  addToCanvas(canvas: HTMLCanvasElement, textureAtlas: HTMLImageElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Could not get canvas context")
    this.draw(ctx, textureAtlas)
    this.isRevealed.subscribe(() => this.draw(ctx, textureAtlas))
    this.isFlagged.subscribe(() => this.draw(ctx, textureAtlas))
  }

  draw(ctx: CanvasRenderingContext2D, textureAtlas: HTMLImageElement) {
    if (get(this.isRevealed)) {
      if (this.isMine) {
        this.drawAtPos(ctx, textureAtlas, 1, 3)
      } else {
        switch (this.numAdjacentMines) {
          case 0:
            this.drawAtPos(ctx, textureAtlas, 0, 0)
            break
          case 1:
            this.drawAtPos(ctx, textureAtlas, 1, 0)
            break
          case 2:
            this.drawAtPos(ctx, textureAtlas, 2, 0)
            break
          case 3:
            this.drawAtPos(ctx, textureAtlas, 3, 0)
            break
          case 4:
            this.drawAtPos(ctx, textureAtlas, 0, 1)
            break
          case 5:
            this.drawAtPos(ctx, textureAtlas, 1, 1)
            break
          case 6:
            this.drawAtPos(ctx, textureAtlas, 2, 1)
            break
          case 7:
            this.drawAtPos(ctx, textureAtlas, 3, 1)
            break
          case 8:
            this.drawAtPos(ctx, textureAtlas, 0, 2)
        }
      }
    } else if (get(this.isFlagged)) {
      this.drawAtPos(ctx, textureAtlas, 2, 2)
    } else {
      this.drawAtPos(ctx, textureAtlas, 1, 2)
    }
  }

  private drawAtPos(
    ctx: CanvasRenderingContext2D,
    textureAtlas: HTMLImageElement,
    x: number,
    y: number
  ) {
    ctx.drawImage(
      textureAtlas,
      x * 16,
      y * 16,
      16,
      16,
      this.x * 16,
      this.y * 16,
      16,
      16
    )
  }
}
