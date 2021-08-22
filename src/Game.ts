import { Player } from "./Player"
import { Tile } from "./Tile"

export class Game {
  player1: Player
  player2: Player
  stock: Tile[]

  constructor() {
    this.player1 = new Player()
    this.player2 = new Player()
    this.stock = []
  }

  reload(): void {
    this.stock = []
    this.player1.reset()
    this.player2.reset()

    const characters = ["east", "south", "west", "north", "white", "green", "red"]
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const kinds = ["pin", "sou", "man"]
    for (let i = 0; i < characters.length; i++) {
      for (let j = 0; j < 4; j++) {
        const tile = new Tile("", 0, characters[i])
        this.stock.push(tile)
      }
    }
    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < kinds.length; j++) {
        if (numbers[i] >= 2 && numbers[i] <= 8 && kinds[j] != "pin") { continue }
        for (let k = 0; k < 4; k++) {
          const tile = new Tile(kinds[j], numbers[i], "")
          this.stock.push(tile)
        }
      }
    }

    // shuffle
    for (let i = this.stock.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i+1))
      const tmp = this.stock[i]
      this.stock[i] = this.stock[r]
      this.stock[r] = tmp
    }

    const player1Tiles = this.stock.splice(0, 13)
    const player2Tiles = this.stock.splice(0, 13)
    console.log('stock count ', this.stock.length)

    this.player1.tiles = player1Tiles
    this.player2.tiles = player2Tiles
  }

  draw(): Tile | undefined { return this.stock.shift() }
}

