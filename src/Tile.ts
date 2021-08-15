export class Tile {
  kind: string
  number: number
  character: string

  constructor(kind: string, number: number, character: string) {
    this.kind = kind
    this.number = number
    this.character = character
  }

  isEqual(tile: Tile) {
    return this.kind === tile.kind && this.number === tile.number && this.character === tile.character
  }

  isPinzu() {
    return this.kind === "pin"
  }

  copy() {
    return new Tile(this.kind, this.number, this.character)
  }
}
