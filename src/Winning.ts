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
  hands: Hand[]

  constructor(kotz: Tile[][], shuntz: Tile[][], jantou: Tile[], chiitoi: Tile[][], kokushi: Tile[]) {
    this.kotz = kotz
    this.shuntz = shuntz
    this.jantou = jantou
    this.chiitoi = chiitoi
    this.kokushi = kokushi
    this.hands = []
  }

}
