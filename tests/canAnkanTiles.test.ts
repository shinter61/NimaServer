import { Tile } from "../src/Tile"
import { Player } from "../src/Player"

describe("暗槓ができるバターンのテスト", () => {
  test("パターン1", () => {
    const testPlayer = new Player()
    testPlayer.riichiTurn = 6
    testPlayer.tiles = [
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("sou", 2, ""), new Tile("sou", 3, ""), new Tile("sou", 4, ""),
      new Tile("sou", 6, ""), new Tile("sou", 7, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""),
      new Tile("", 0, "east"), new Tile("", 0, "east"), new Tile("", 0, "east"), new Tile("", 0, "east")
    ]
    expect(testPlayer.canAnkanTiles(new Tile("", 0, "east"))).toEqual([new Tile("", 0, "east")])
  })
})

describe("待ち牌が変わって暗槓ができないバターンのテスト", () => {
  test("パターン1", () => {
    const testPlayer = new Player()
    testPlayer.riichiTurn = 6
    testPlayer.tiles = [
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("sou", 2, ""), new Tile("sou", 3, ""), new Tile("sou", 4, ""),
      new Tile("sou", 7, ""), new Tile("sou", 7, ""), new Tile("sou", 7, ""), new Tile("sou", 7, ""),
      new Tile("sou", 9, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, ""),
    ]
    expect(testPlayer.canAnkanTiles(new Tile("sou", 7, ""))).toEqual([])
  })
})

describe("面子構成が変わって暗槓ができないバターンのテスト", () => {
  test("パターン1", () => {
    const testPlayer = new Player()
    testPlayer.riichiTurn = 6
    testPlayer.tiles = [
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("sou", 2, ""), new Tile("sou", 3, ""),
      new Tile("sou", 4, ""), new Tile("sou", 4, ""), new Tile("sou", 4, ""), new Tile("sou", 4, ""),
      new Tile("sou", 7, ""), new Tile("sou", 8, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, ""),
    ]
    expect(testPlayer.canAnkanTiles(new Tile("sou", 4, ""))).toEqual([])
  })

  test("パターン2", () => {
    const testPlayer = new Player()
    testPlayer.riichiTurn = 6
    testPlayer.tiles = [
      new Tile("sou", 1, ""), new Tile("sou", 2, ""), new Tile("sou", 3, ""),
      new Tile("sou", 4, ""), new Tile("sou", 4, ""), new Tile("sou", 4, ""), new Tile("sou", 4, ""),
      new Tile("sou", 6, ""), new Tile("sou", 7, ""), new Tile("sou", 8, ""), new Tile("sou", 9, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, ""),
    ]
    expect(testPlayer.canAnkanTiles(new Tile("sou", 1, ""))).toEqual([])
  })
})

describe("待ちの形が変わって暗槓ができないバターンのテスト", () => {
  test("パターン1", () => {
    const testPlayer = new Player()
    testPlayer.riichiTurn = 6
    testPlayer.tiles = [
      new Tile("sou", 1, ""), new Tile("sou", 2, ""), new Tile("sou", 3, ""),
      new Tile("sou", 6, ""), new Tile("sou", 6, ""), new Tile("sou", 6, ""), new Tile("sou", 7, ""),
      new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, ""),
    ]
    expect(testPlayer.canAnkanTiles(new Tile("sou", 9, ""))).toEqual([])
  })
})
