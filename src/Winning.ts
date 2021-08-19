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
    // 1飜役
    this.judgeRiichi()
    this.judgeIppatsu()
    this.judgeTsumo()
    this.judgePinfu()
    this.judgeTanyao()
    this.judgeIpeko()
    this.judgeYakuhai()
    this.judgeBakaze()
    this.judgeJikaze()
    this.judgeRinsyan()
    this.judgeChankan()
    this.judgeHaitei()
    this.judgeHoutei()

    // 2飜役
    this.judgeDoubleRiichi()
    this.judgeChanta()
    this.judgeHonroto()
    this.judgeIttsu()
    this.judgeToiToi()
    this.judgeSansyoku()
    this.judgeSananko()
    this.judgeSankantsu()
    this.judgeChiitoi()
    this.judgeShosangen()

    // 3飜役、6飜役
    this.judgeHonitsu()
    this.judgeRyanpeko()
    this.judgeJunchan()
    this.judgeChinitsu()

    // 役満
    this.judgeTenho()
    this.judgeChiho()
    this.judgeDaisangen()
    this.judgeShosushi()
    this.judgeDaisushi()
    this.judgeSuanko()
    this.judgeChinroto()
    this.judgeSukantsu()
    this.judgeTsuiso()
    this.judgeKokushi()
    this.judgeChuren()

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

  judgeTanyao(): void {
    const flattenTiles = this.flatten()
    if (flattenTiles.every(tile => !tile.isYaochu())) { this.hands.push({ name: "断么九", han: 1 }) }
  }

  // 要改善：門前の条件
  judgeIpeko(): void {
    if (this.shuntz.length <= 1) { return }
    const combiArr = [...Array(this.shuntz.length).keys()].map(el => el + 1)
    combiArr.pop()
    let isIpeko = false
    for (let i = 0; i < this.shuntz.length; i++) {
      for (let j = 0; j < combiArr.length; j++) {
        const shuntz1 = this.shuntz[i]
        const shuntz2 = this.shuntz[combiArr[j]]
        if (shuntz1[0].isEqual(shuntz2[0]) && shuntz1[1].isEqual(shuntz2[1]) && shuntz1[2].isEqual(shuntz2[2])) { isIpeko = true }
      }
      combiArr.shift()
    }

    if (isIpeko) { this.hands.push({ name: "一盃口", han: 1 }) }
  }

  judgeYakuhai(): void {
    for (let i = 0; i < this.kotz.length; i++) {
      if (this.kotz[i][0].character === "white") { this.hands.push({ name: "役牌: 白", han: 1 })  }
      if (this.kotz[i][0].character === "green") { this.hands.push({ name: "役牌: 發", han: 1 })  }
      if (this.kotz[i][0].character === "red") { this.hands.push({ name: "役牌: 中", han: 1 })  }
    }
  }

  judgeBakaze(): void {
    // if (false) { this.hands.push({ name: "場風牌: 東", han: 1 }) }
  }

  judgeJikaze(): void {
    // if (false) { this.hands.push({ name: "自風牌: 東", han: 1 }) }
  }

  judgeRinsyan(): void {
    // if (false) { this.hands.push({ name: "嶺上開花", han: 1 }) }
  }

  judgeChankan(): void {
    // if (false) { this.hands.push({ name: "槍槓", han: 1 }) }
  }

  judgeHaitei(): void {
    // if (false) { this.hands.push({ name: "海底撈月", han: 1 }) }
  }

  judgeHoutei(): void {
    // if (false) { this.hands.push({ name: "河底撈魚", han: 1 }) }
  }

  judgeDoubleRiichi(): void {
    // if (false) { this.hands.push({ name: "ダブル立直", han: 2 }) }
  }

  // 要改善：食い下がり１飜の実装
  judgeChanta(): void {
    if (this.chiitoi.length !== 0 || this.kokushi.length !== 0) { return }

    let isChanta = true
    for (let i = 0; i < this.shuntz.length; i++) {
      if (![1, 7].includes(this.shuntz[i][0].number)) { isChanta = false }
    }
    for (let i = 0; i < this.kotz.length; i++) {
      if (!this.kotz[i][0].isYaochu()) { isChanta = false }
    }
    if (!this.jantou[0].isYaochu()) { isChanta = false }

    if (isChanta) { this.hands.push({ name: "混全帯么九", han: 2 }) }
  }

  judgeHonroto(): void {
    let isHonroto = true
    const flattenTiles = this.flatten()
    for (let i = 0; i < flattenTiles.length; i++) {
      if (!flattenTiles[i].isYaochu()) { isHonroto = false }
    }
    if (isHonroto) { this.hands.push({ name: "混老頭", han: 2 }) }
  }

  // 要改善：食い下がり１飜の実装
  judgeIttsu(): void {
    const testArr = [false, false, false]
    for (let i = 0; i < this.shuntz.length; i++) {
      if (this.shuntz[i][0].isEqual(new Tile("pin", 1, ""))) { testArr[0] = true }
      if (this.shuntz[i][0].isEqual(new Tile("pin", 4, ""))) { testArr[1] = true }
      if (this.shuntz[i][0].isEqual(new Tile("pin", 7, ""))) { testArr[2] = true }
    }
    if (testArr.every(el => el)) { this.hands.push({ name: "一気通貫", han: 2 }) }
  }

  judgeToiToi(): void {
    if (this.kotz.length === 4) { this.hands.push({ name: "対々和", han: 2 }) }
  }

  judgeSansyoku(): void {
    const oneArr = [false, false, false]
    const nineArr = [false, false, false]
    for (let i = 0; i < this.kotz.length; i++) {
      if (this.kotz[i][0].isEqual(new Tile("pin", 1, ""))) { oneArr[0] = true }
      if (this.kotz[i][0].isEqual(new Tile("sou", 1, ""))) { oneArr[1] = true }
      if (this.kotz[i][0].isEqual(new Tile("man", 1, ""))) { oneArr[2] = true }
      if (this.kotz[i][0].isEqual(new Tile("pin", 9, ""))) { nineArr[0] = true }
      if (this.kotz[i][0].isEqual(new Tile("sou", 9, ""))) { nineArr[1] = true }
      if (this.kotz[i][0].isEqual(new Tile("man", 9, ""))) { nineArr[2] = true }
    }

    if (oneArr.every(el => el) || nineArr.every(el => el)) { this.hands.push({ name: "三色同刻", han: 2 }) }
  }

  judgeSananko(): void {
    // if (false) { this.hands.push({ name: "三暗刻", han: 2 }) }
  }

  judgeSankantsu(): void {
    // if (false) { this.hands.push({ name: "三槓子", han: 2 }) }
  }

  judgeChiitoi(): void {
    if (this.chiitoi.length !== 0) { this.hands.push({ name: "七対子", han: 2 }) }
  }

  judgeShosangen(): void {
    let kotzNum = 0
    for (let i = 0; i < this.kotz.length; i++) {
      if (["white", "green", "red"].includes(this.kotz[i][0].character)) { kotzNum++ }
    }
    if (kotzNum === 2) { this.hands.push({ name: "小三元", han: 2 }) }
  }

  judgeHonitsu(): void {
    const flattenTiles = this.flatten()
    const kindArr = flattenTiles.map(tile => tile.kind)
    const uniqKindArr = Array.from(new Set(kindArr))

    if (uniqKindArr.length === 2 && uniqKindArr.includes("")) {
      this.hands.push({ name: "混一色", han: 3 })
    }
  }

  judgeRyanpeko(): void {
    if (this.shuntz.length !== 4) { return }
    const shuntzCopy: Tile[][] = this.shuntz.slice()
    let ipekoCount = 0

    for (let i = 0; i < shuntzCopy.length; i++) {
      for (let j = i; j < shuntzCopy.length; j++) {
        if (i === j) { continue }
        if (shuntzCopy[i][0].isEqual(shuntzCopy[j][0])) {
          ipekoCount++
          shuntzCopy.splice(i, 1)
          shuntzCopy.splice(j - 1, 1)
          break
        }
      }
    }

    if (shuntzCopy[0][0].isEqual(shuntzCopy[1][0])) { ipekoCount++ }

    if (ipekoCount == 2) { this.hands.push({ name: "二盃口", han: 3 }) }
  }

  judgeJunchan(): void {
    let isJunchan = true
    for (let i = 0; i < this.shuntz.length; i++) {
      if (![1, 7].includes(this.shuntz[i][0].number)) { isJunchan = false }
    }
    for (let i = 0; i < this.kotz.length; i++) {
      if (!this.kotz[i][0].is19()) { isJunchan = false }
    }
    if (!this.jantou[0].is19()) { isJunchan = false }

    if (isJunchan) { this.hands.push({ name: "純全帯么九", han: 3 }) }
  }

  judgeChinitsu(): void {
    const flattenTiles = this.flatten()
    const kindArr = flattenTiles.map(tile => tile.kind)
    const uniqKindArr = Array.from(new Set(kindArr))

    if (uniqKindArr.length === 1 && uniqKindArr[0] === "pin") {
      this.hands.push({ name: "清一色", han: 6 })
    }
  }

  judgeTenho(): void {
    // if (false) { this.hands.push({ name: "天和", han: 100 }) }
  }

  judgeChiho(): void {
    // if (false) { this.hands.push({ name: "地和", han: 100 }) }
  }

  judgeDaisangen(): void {
    let kotzNum = 0
    for (let i = 0; i < this.kotz.length; i++) {
      if (["white", "green", "red"].includes(this.kotz[i][0].character)) { kotzNum++ }
    }
    if (kotzNum === 3) { this.hands.push({ name: "大三元", han: 100 }) }
  }

  judgeShosushi(): void {
    if (this.kotz.length < 3) { return }
    const winds: string[] = ["east", "south", "west", "north"]
    for (let i = 0; i < this.kotz.length; i++) {
      if (winds.includes(this.kotz[i][0].character)) {
        const index = winds.findIndex(wind => wind === this.kotz[i][0].character)
        if (index !== -1) { winds.splice(index, 1) }
      }
    }
    if (winds.length === 1 && winds[0] === this.jantou[0].character) { this.hands.push({ name: "小四喜", han: 100 }) }
  }

  judgeDaisushi(): void {
    if (this.kotz.length < 4) { return }
    const winds: string[] = ["east", "south", "west", "north"]
    for (let i = 0; i < this.kotz.length; i++) {
      if (winds.includes(this.kotz[i][0].character)) {
        const index = winds.findIndex(wind => wind === this.kotz[i][0].character)
        if (index !== -1) { winds.splice(index, 1) }
      }
    }
    if (winds.length === 0) { this.hands.push({ name: "大四喜", han: 200 }) }
  }

  judgeSuanko(): void {
    // if (false) { this.hands.push({ name: "四暗刻", han: 100 }) }
  }

  judgeChinroto(): void {
    if (this.kotz.length !== 4) { return }
    let isChinroto = true 
    for (let i = 0; i < this.kotz.length; i++) {
      if (!this.kotz[i][0].is19()) { isChinroto = false }
    }
    if (isChinroto) { this.hands.push({ name: "清老頭", han: 100 }) }
  }

  judgeSukantsu(): void {
    // if (false) { this.hands.push({ name: "四槓子", han: 100 }) }
  }

  judgeTsuiso(): void {
    const flattenTiles = this.flatten()
    if (flattenTiles.every(tile => tile.kind === "")) { this.hands.push({ name: "字一色", han: 100 }) }
  }

  judgeKokushi(): void {
    if (this.kokushi.length === 0) { return }
    const alreadyFounded: string[] = []
    let toitzTile: Tile = new Tile("", 0, "")
    for (let i = 0; i < this.kokushi.length; i++) {
      if (alreadyFounded.includes(this.kokushi[i].name())) {
        toitzTile = this.kokushi[i]
        break
      } else { alreadyFounded.push(this.kokushi[i].name()) }
    }

    if (this.draw.isEqual(toitzTile)) { this.hands.push({ name: "国士無双十三面", han: 200 }) }
    else { this.hands.push({ name: "国士無双", han: 100 }) }
  }

  judgeChuren(): void {
    const flattenTiles = this.flatten()
    const churenTiles = [
      new Tile("pin", 1, ""),
      new Tile("pin", 1, ""),
      new Tile("pin", 1, ""),
      new Tile("pin", 2, ""),
      new Tile("pin", 3, ""),
      new Tile("pin", 4, ""),
      new Tile("pin", 5, ""),
      new Tile("pin", 6, ""),
      new Tile("pin", 7, ""),
      new Tile("pin", 8, ""),
      new Tile("pin", 9, ""),
      new Tile("pin", 9, ""),
      new Tile("pin", 9, "")
    ]

    for (let i = 0; i < churenTiles.length; i++) {
      const index = flattenTiles.findIndex(tile => tile.isEqual(churenTiles[i]))
      if (index !== -1) { flattenTiles.splice(index, 1) }
    }
    
    if (flattenTiles.length === 1 && flattenTiles[0].kind === "pin") {
      if (flattenTiles[0].isEqual(this.draw)) { this.hands.push({ name: "純正九蓮宝燈", han: 200 }) }
      else { this.hands.push({ name: "九蓮宝燈", han: 100 }) }
    }
  }
}
