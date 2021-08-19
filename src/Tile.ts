export class Tile {
  kind: string
  number: number
  character: string

  constructor(kind: string, number: number, character: string) {
    this.kind = kind
    this.number = number
    this.character = character
  }

  isEqual(tile: Tile): boolean {
    return this.kind === tile.kind && this.number === tile.number && this.character === tile.character
  }

  isPinzu(): boolean {
    return this.kind === "pin"
  }

  isYaochu(): boolean {
    return this.character !== "" || this.number === 1 || this.number === 9
  }

  is19(): boolean {
    return this.number === 1 || this.number === 9
  }

  name(): string {
    return String(this.number) + this.kind + this.character
  }

  copy(): Tile {
    return new Tile(this.kind, this.number, this.character)
  }
}

export const allTiles: Tile[] = [
  new Tile("pin", 1, ""),
  new Tile("pin", 2, ""),
  new Tile("pin", 3, ""),
  new Tile("pin", 4, ""),
  new Tile("pin", 5, ""),
  new Tile("pin", 6, ""),
  new Tile("pin", 7, ""),
  new Tile("pin", 8, ""),
  new Tile("pin", 9, ""),
  new Tile("sou", 1, ""),
  new Tile("sou", 9, ""),
  new Tile("man", 1, ""),
  new Tile("man", 9, ""),
  new Tile("", 0, "east"),
  new Tile("", 0, "south"),
  new Tile("", 0, "west"),
  new Tile("", 0, "north"),
  new Tile("", 0, "white"),
  new Tile("", 0, "green"),
  new Tile("", 0, "red")
]
