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

  copy(): Tile {
    return new Tile(this.kind, this.number, this.character)
  }
}

export type Winning =  {
  mentz: Tile[][]
  jantou: Tile[]
  chiitoi: Tile[][]
  kokushi: Tile[]
}
