import { Tile } from "./Tile"

type Hand = {
  name: string
  han: number
}

export class Winning {
  kotz: Tile[][]
  shuntz: Tile[][]
  jantou: Tile[]
  chiitoi: Tile[][]
  kokushi: Tile[]
  draw: Tile
  hands: Hand[]

  constructor(kotz: Tile[][], shuntz: Tile[][], jantou: Tile[], chiitoi: Tile[][], kokushi: Tile[], draw: Tile) {
    this.kotz = kotz
    this.shuntz = shuntz
    this.jantou = jantou
    this.chiitoi = chiitoi
    this.kokushi = kokushi
    this.draw = draw
    this.hands = []
  }

  flatten(): Tile[] {
    if (this.chiitoi.length !== 0) {
      return this.chiitoi.flat()
    } else if (this.kokushi.length !== 0) {
      return this.kokushi
    } else {
      return [this.jantou, this.shuntz, this.kotz].flat(3)
    }
  }

  judgeHands(): number {
    this.judgeRiichi()
    this.judgeIppatsu()
    this.judgeTsumo()
    this.judgePinfu()
    this.judgeHonitsu()

    return this.hands.map(hand => hand.han).reduce((sum, el) => sum + el, 0)
  }

  judgeRiichi(): void {
    // if (false) { this.hands.push({ name: "立直", han: 1 }) }
  }

  judgeIppatsu(): void {
    // if (false) { this.hands.push({ name: "一発", han: 1 }) }
  }

  judgeTsumo(): void {
    // if (false) { this.hands.push({ name: "門前清自摸和", han: 1 }) }
  }

  // 要改善：門前の条件 & 雀頭が風牌でないこと
  judgePinfu(): void {
    let isRyanmen = false
    for (let i = 0; i < this.shuntz.length; i++) {
      if (this.shuntz[i][0].isEqual(this.draw) || this.shuntz[i][2].isEqual(this.draw)) { isRyanmen = true }
    }
    if (this.shuntz.length === 4 && !["white", "green", "red"].includes(this.jantou[0].character) && isRyanmen) {
      this.hands.push({ name: "平和", han: 1 })
    }
  }

  judgeHonitsu(): void {
    const flattenTiles = this.flatten()
    const kindArr = flattenTiles.map(tile => tile.kind)
    const uniqKindArr = Array.from(new Set(kindArr))

    if (uniqKindArr.length === 2 && uniqKindArr.includes("")) {
      this.hands.push({ name: "混一色", han: 3 })
    }
  }
}
