import { Tile } from "./Tile"

export class Winning {
  mentz: Tile[][]
  jantou: Tile[]
  chiitoi: Tile[][]
  kokushi: Tile[]

  constructor(mentz: Tile[][], jantou: Tile[], chiitoi: Tile[][], kokushi: Tile[]) {
    this.mentz = mentz
    this.jantou = jantou
    this.chiitoi = chiitoi
    this.kokushi = kokushi
  }
}
