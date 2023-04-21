import type { Readable } from "svelte/store"
import { derived } from "svelte/store"
import { shuffle } from "../../../scripts/util"
import Cell from "./cell"

function generateMines(
  width: number,
  height: number,
  mines: number
): [number, number][] {
  const positions: [number, number][] = Array.from(
    Array(width * height),
    (_, i) => [i % width, Math.floor(i / width)]
  )
  return shuffle(positions).slice(0, mines)
}

function calculateAdjacentMines(
  width: number,
  height: number,
  mineLocations: [number, number][]
): [boolean, number][][] {
  const board: [boolean, number][][] = Array.from(Array(width), () =>
    Array.from(Array(height), () => [false, 0])
  )

  // Loop through all mine locations and increment adjacent cells
  for (const [mineX, mineY] of mineLocations) {
    board[mineX][mineY] = [true, 0]
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const adjacentX = mineX + dx
        const adjacentY = mineY + dy
        if (
          adjacentX >= 0 &&
          adjacentX < width &&
          adjacentY >= 0 &&
          adjacentY < height &&
          !board[adjacentX][adjacentY][0]
        ) {
          board[adjacentX][adjacentY][1]++
        }
      }
    }
  }

  return board
}

enum GameStatus {
  Playing,
  Won,
  Lost,
}

export class GameBoard {
  public readonly cells: readonly (readonly Cell[])[]
  public readonly status: Readable<GameStatus>

  constructor(
    readonly width: number,
    readonly height: number,
    readonly mines: number
  ) {
    const mineLocations = generateMines(width, height, mines)
    const adjacentMines = calculateAdjacentMines(width, height, mineLocations)
    const flaggedCorrectlyStores: Readable<boolean>[] = []
    const revealedCorrectlyStores: Readable<boolean>[] = []
    const hasLostStores: Readable<boolean>[] = []
    const cells: Cell[][] = Array.from(Array(width), () => Array(height))
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const [isMine, numAdjacentMines] = adjacentMines[x][y]
        const cell = new Cell(x, y, isMine, numAdjacentMines)
        flaggedCorrectlyStores.push(cell.flaggedCorrectly)
        revealedCorrectlyStores.push(cell.revealedCorrectly)
        hasLostStores.push(cell.hasLost)
        cells[x][y] = cell
      }
    }
    this.cells = cells

    const allFlaggedCorrectly = derived(
      flaggedCorrectlyStores,
      ($flaggedCorrectly) => $flaggedCorrectly.every((b) => b)
    )
    const allRevealedCorrectly = derived(
      revealedCorrectlyStores,
      ($revealedCorrectly) => $revealedCorrectly.every((b) => b)
    )
    const anyHasLost = derived(hasLostStores, ($hasLost) =>
      $hasLost.some((b) => b)
    )
    this.status = derived(
      [allFlaggedCorrectly, allRevealedCorrectly, anyHasLost],
      ([$allFlaggedCorrectly, $allRevealedCorrectly, $anyHasLost]) => {
        if ($anyHasLost) {
          return GameStatus.Lost
        } else if ($allFlaggedCorrectly || $allRevealedCorrectly) {
          return GameStatus.Won
        } else {
          return GameStatus.Playing
        }
      }
    )
  }
}
