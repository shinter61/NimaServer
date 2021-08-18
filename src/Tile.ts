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
