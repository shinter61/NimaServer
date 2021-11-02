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

  isSouzu(): boolean {
    return this.kind === "sou"
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

  next(): Tile | undefined {
    const nextTile = this.copy()
    if (nextTile.kind === "sou") {
      nextTile.number += 1
      if (nextTile.number === 10) { nextTile.number = 1 }
      return nextTile
    }
    if (nextTile.kind === "pin" || nextTile.kind === "man") {
      nextTile.number === 1 ? nextTile.number = 9 : nextTile.number = 1
      return nextTile
    }
    const windArr = ["east", "south", "west", "north"]
    if (windArr.includes(nextTile.character)) {
      let index = windArr.findIndex(wind => nextTile.character === wind)
      index += 1
      if (index === 4) { index = 0 }
      nextTile.character = windArr[index]
      return nextTile
    }
    const dragonArr = ["white", "green", "red"]
    if (dragonArr.includes(nextTile.character)) {
      let index = dragonArr.findIndex(wind => nextTile.character === wind)
      index += 1
      if (index === 3) { index = 0 }
      nextTile.character = dragonArr[index]
      return nextTile
    }
  }
}

export const allTiles: Tile[] = [
  new Tile("sou", 1, ""),
  new Tile("sou", 2, ""),
  new Tile("sou", 3, ""),
  new Tile("sou", 4, ""),
  new Tile("sou", 5, ""),
  new Tile("sou", 6, ""),
  new Tile("sou", 7, ""),
  new Tile("sou", 8, ""),
  new Tile("sou", 9, ""),
  new Tile("pin", 1, ""),
  new Tile("pin", 9, ""),
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
