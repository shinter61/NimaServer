import { Tile } from "./Tile"
import { Winning } from "./Winning"

export class Player {
  name: string
  discards: Tile[]
  tiles: Tile[]

  constructor() {
    this.name = ""
    this.discards = []
    this.tiles = []
  }

  organizeTile(): void {
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

  extractShuntz(firstIdx: number, secondIdx?: number): Tile[] {
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

  judgeHands(): Winning[] {
    const myTilesCopy: Tile[] = this.tiles.slice()
    const ankoTiles: Tile[] = []
    const pinzuAnkoTiles: Tile[] = []
    let mentzTiles: Tile[][] = []
    let dupCount = 0
    let prevTile: Tile = new Tile("", 0, ""), jantou: Tile[] = []
    const winnings: Winning[] = []

    this.organizeTile()

    // 七対子判定
    const chiitoi = this.judgeChiitoi()
    if (chiitoi !== undefined) {
      this.tiles = myTilesCopy
      winnings.push(chiitoi)
    }

    // 国士判定
    const kokushi = this.judgeKokushi()
    if (kokushi !== undefined) {
      this.tiles = myTilesCopy
      return [kokushi]
    }

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

    // 各刻子に対し、「刻子として抜き出す（3）」、「雀頭＋１牌とする(2,1)」、「何もしない(1,1,1)」の３パターンがある
    //「刻子として抜き出す（3）」→ 0、「雀頭＋１牌とする(2,1)」→ 1、「何もしない(1,1,1)」→ 2
    // 複数の刻子に対し「雀頭＋１牌とする(2,1)」の扱いをすることはない
    // bit全探索 3進数ver.
    const patterns: number[][] = []
    for (let bit = 0; bit < 3 ** pinzuAnkoTiles.length; bit++) {
      let tmp = bit
      const row = []
      for (let i = 0; i < pinzuAnkoTiles.length; i++) {
        row[i] = tmp % 3;
        tmp = Math.floor(tmp/3)
      }
      if (row.filter(el => el === 1).length >= 2) { continue }
      patterns.push(row)
    }

    // 探索前に各値を、リセット用にコピー
    const myTilesCopy2 = this.tiles.slice()
    const mentzTilesCopy = mentzTiles.slice()

    // 全パターン探索
    for (let i = 0; i < patterns.length; i++) {
      for (let j = 0; j < patterns[i].length; j++) {
        if (patterns[i][j] === 0) {
          // 「刻子として抜き出す（3）」
          const index = this.tiles.findIndex(tile => tile.isEqual(pinzuAnkoTiles[j]))
          const mentz: Tile[] = this.tiles.splice(index, 3)
          mentzTiles.push(mentz)
        } else if (patterns[i][j] === 1) {
          // 「雀頭＋１牌とする(2,1)」
          const index = this.tiles.findIndex(tile => tile.isEqual(pinzuAnkoTiles[j]))
          jantou = this.tiles.splice(index, 2)
        } else if (patterns[i][j] === 2) {
          // 「何もしない(1,1,1)」
          continue
        }
      }

      // 順子抜き出し
      for (let i = 0; i < this.tiles.length; i++) {
        const shuntz: Tile[] = this.extractShuntz(i)
        if (shuntz.length !== 0) {
          mentzTiles.push(shuntz)
          i -= 3
        }
      }

      // 雀頭がない場合、雀頭を登録
      if (this.tiles.length === 2 && this.tiles[0].isEqual(this.tiles[1])) { jantou = this.tiles.splice(0, 2) }

      if (mentzTiles.length === 4 && jantou.length !== 0) {
        winnings.push(new Winning(mentzTiles, jantou, [], []))
      }
      this.tiles = myTilesCopy2.slice()
      mentzTiles = mentzTilesCopy.slice()
      jantou = []
    }

    // 元の牌姿に戻す
    this.tiles = myTilesCopy

    return winnings
  }

  judgeChiitoi(): Winning | undefined {
    let toitzNum = 0
    const chiitoi: Tile[][] = []
    for (let i = 0; i < this.tiles.length - 1; i++) {
      if (i % 2 === 0 && this.tiles[i].isEqual(this.tiles[i+1])) {
        toitzNum++
        chiitoi.push([this.tiles[i], this.tiles[i+1]])
      }
    }
    if (toitzNum === 7) { return new Winning([], [], chiitoi, []) }
  }

  judgeKokushi(): Winning | undefined {
    let toitzNum = 0
    const alreadyFounded: Tile[] = []
    for (let i = 0; i < this.tiles.length; i++) {
      if (i != this.tiles.length - 1 && this.tiles[i].isEqual(this.tiles[i+1])) { toitzNum++ }
      if (this.tiles[i].isYaochu() && alreadyFounded.find(tile => tile.isEqual(this.tiles[i])) === undefined) {
        alreadyFounded.push(this.tiles[i])
      }
    }

    if (alreadyFounded.length === 13 && toitzNum === 1) {
      return new Winning([], [], [], this.tiles)
    }
  }
}
