import { Tile } from "./Tile"

export class Player {
  name: string
  discards: Tile[]
  tiles: Tile[]

  constructor() {
    this.name = ""
    this.discards = []
    this.tiles = []
  }

  organizeTile() {
    const pinzuTiles: Tile[] = []
    const souzuTiles: Tile[] = []
    const manzuTiles: Tile[] = []
    const eastTiles: Tile[] = []
    const southTiles: Tile[] = []
    const westTiles: Tile[] = []
    const northTiles: Tile[] = []
    const whiteTiles: Tile[] = []
    const greenTiles: Tile[] = []
    const redTiles: Tile[] = []

    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].kind == "pin") { pinzuTiles.push(this.tiles[i]) }
      else if (this.tiles[i].kind == "sou") { souzuTiles.push(this.tiles[i]) }
      else if (this.tiles[i].kind == "man") { manzuTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "east") { eastTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "south") { southTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "west") { westTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "north") { northTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "white") { whiteTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "green") { greenTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "red") { redTiles.push(this.tiles[i]) }
    }

    pinzuTiles.sort(function(a, b) {
      if (a.number < b.number) return -1;
      if (a.number > b.number) return 1;
      return 0;
    })
    manzuTiles.sort(function(a, b) {
      if (a.number < b.number) return -1;
      if (a.number > b.number) return 1;
      return 0;
    })
    souzuTiles.sort(function(a, b) {
      if (a.number < b.number) return -1;
      if (a.number > b.number) return 1;
      return 0;
    })

    this.tiles = ([] as Tile[]).concat(pinzuTiles, souzuTiles, manzuTiles, eastTiles, southTiles, westTiles, northTiles,
      whiteTiles, greenTiles, redTiles)
  }

  extractShuntz(firstIdx: number, secondIdx?: number) {
    let mentz: Tile[] = []
    if (firstIdx >= this.tiles.length || firstIdx <= -1) { return mentz }
    if (!this.tiles[firstIdx].isPinzu()) { return mentz }

    if (secondIdx === undefined) {
      const currentTile: Tile = this.tiles[firstIdx].copy()
      currentTile.number += 1
      for (let i = firstIdx + 1; i < this.tiles.length; i++) {
        if (this.tiles[i].isEqual(currentTile)) {
          mentz = this.extractShuntz(firstIdx, i)
          break
        }
      }
    } else {
      const currentTile: Tile = this.tiles[secondIdx].copy()
      currentTile.number += 1
      for (let thirdIdx = secondIdx + 1; thirdIdx < this.tiles.length; thirdIdx++) {
        if (this.tiles[thirdIdx].isEqual(currentTile)) {
          mentz.push(this.tiles.splice(firstIdx, 1)[0])
          mentz.push(this.tiles.splice(secondIdx - 1, 1)[0])
          mentz.push(this.tiles.splice(thirdIdx - 2, 1)[0])
          break
        }
      }
    }
    
    return mentz
  }

  judgeHands() {
    const myTilesCopy: Tile[] = this.tiles.slice()
    const ankoTiles: Tile[] = []
    let pinzuAnkoTiles: Tile[] = []
    const mentzTiles: Tile[][] = [], jantou = null
    let dupCount = 0
    let prevTile: Tile = new Tile("", 0, "")
    let isWin = false

    this.organizeTile()

    for (let i = 0; i < this.tiles.length; i++) {
      if (prevTile.isEqual(this.tiles[i])) {
        dupCount++;
        if (dupCount == 3) { ankoTiles.push(this.tiles[i]) }
      } else {
        dupCount = 1
        prevTile = this.tiles[i]
      }
    }

    // 筒子の暗刻を取り出す、それ以外の牌の暗刻は面子としてしか使えないため
    for (let i = 0; i < ankoTiles.length; i++) {
      if (ankoTiles[i].kind === "pin") {
        pinzuAnkoTiles.push(ankoTiles[i])
      } else {
        const index = this.tiles.findIndex(tile => tile.isEqual(ankoTiles[i]))
        const mentz: Tile[] = this.tiles.splice(index, 3)
        mentzTiles.push(mentz)
      }
    }

    pinzuAnkoTiles = ankoTiles.filter(tile => tile.kind === "pin")

    // 面子→雀頭
    for (let i = 0; i < this.tiles.length; i++) {
      const shuntz: Tile[] = this.extractShuntz(i)
      if (shuntz.length !== 0) {
        mentzTiles.push(shuntz)
        i -= 3
      }
    }
    console.log('remained tiles ', this.tiles)
    if (this.tiles.length === 2 && this.tiles[0].isEqual(this.tiles[1])) { isWin = true }
    
    console.log('mentz tiles ', mentzTiles)

    // 元の牌姿に戻す
    this.tiles = myTilesCopy

    return isWin
  }
}
