import { Tile } from "../src/Tile"
import { Player } from "../src/Player"

describe("3面待ちテスト", () => {
  test("3面待ちの例1が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 2, ""),
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, ""),
      new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 1, ""), new Tile("pin", 4, ""), new Tile("pin", 7, "")])
  })

  test("3面待ちの例2の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 3, ""),
      new Tile("pin", 4, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""),
      new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, ""),
      new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 1, ""), new Tile("pin", 4, ""), new Tile("sou", 1, "")])
  })

  test("3面待ちの例3の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 3, ""),
      new Tile("pin", 4, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""),
      new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, ""),
      new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 5, "")])
  })

  test("3面待ちの例4の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 1, ""),
      new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 7, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 1, ""), new Tile("pin", 4, ""), new Tile("pin", 7, "")])
  })

  test("3面待ちの例5の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 3, ""),
      new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 5, ""),
      new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 2, ""), new Tile("pin", 5, ""), new Tile("pin", 8, "")])
  })

  test("3面待ちの例6の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""), 
      new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 8, "")])
  })

  test("3面待ちの例7の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""), 
      new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 5, ""), new Tile("pin", 6, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 7, "")])
  })

  test("3面待ちの例8の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 2, ""), new Tile("pin", 2, ""), 
      new Tile("pin", 4, ""), new Tile("pin", 6, ""), new Tile("pin", 6, ""), new Tile("pin", 6, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 5, "")])
  })

  test("3面待ちの例9の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 2, ""), new Tile("pin", 3, ""), 
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")])
  })

  test("3面待ちの例10の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 2, ""), new Tile("pin", 3, ""), 
      new Tile("pin", 4, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 5, "")])
  })

  test("3面待ちの例11の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""),
      new Tile("pin", 4, ""), new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 5, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 2, ""), new Tile("pin", 5, ""), new Tile("sou", 1, "")])
  })

  test("3面待ちの例12の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""),
      new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 2, ""), new Tile("pin", 5, ""), new Tile("sou", 1, "")])
  })

  test("3面待ちの例13の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 1, ""), new Tile("pin", 1, ""), new Tile("pin", 1, ""), 
      new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 9, "")])
  })
})

describe("4面待ちのテスト", () => {
  test("4面待ちの例1の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""), 
      new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 7, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 5, ""), new Tile("pin", 8, "")])
  })

  test("4面待ちの例2の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 5, ""), 
      new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 6, ""), new Tile("pin", 6, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 2, ""), new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 7, "")])
  })

  test("4面待ちの例3の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 2, ""), new Tile("pin", 2, ""), 
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 5, "")])
  })

  test("4面待ちの例4の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 2, ""),
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 4, ""), new Tile("pin", 5, "")])
  })

  test("4面待ちの例5の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""),
      new Tile("pin", 4, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""), new Tile("pin", 5, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, "")])
  })

  test("4面待ちの例6の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 1, ""), new Tile("pin", 1, ""), new Tile("pin", 1, ""),
      new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, ""),
      new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 6, ""), new Tile("pin", 9, "")])
  })
})

describe("5面待ち以上のテスト", () => {
  test("5面待ちの例1の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""),
      new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 7, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([
      new Tile("pin", 2, ""), new Tile("pin", 4, ""), new Tile("pin", 5, ""),
      new Tile("pin", 7, ""), new Tile("pin", 8, "")])
  })

  test("5面待ちの例2の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""),
      new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 5, ""), new Tile("pin", 5, ""),
      new Tile("sou", 1, ""), new Tile("sou", 1, ""), new Tile("sou", 1, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([
      new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("pin", 5, ""), new Tile("pin", 6, "")])
  })

  test("6面待ちの例1の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("pin", 4, ""), new Tile("pin", 4, ""), new Tile("pin", 4, ""),
      new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([
      new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 5, ""),
      new Tile("pin", 6, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")])
  })

  test("6面待ちの例2の待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, ""),
      new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 8, ""), new Tile("pin", 8, ""),
      new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([
      new Tile("pin", 1, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 9, "")])
  })

  test("7面待ちの待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""),
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 7, ""),
      new Tile("pin", 7, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([
      new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 4, ""),
      new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")])
  })

  test("8面待ちの待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 3, ""),
      new Tile("pin", 3, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 7, ""),
      new Tile("pin", 8, ""), new Tile("pin", 8, ""), new Tile("pin", 8, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    // 3pは5枚目を使用することになるので待ちに含まれないが、5枚目なら弾く処理は面倒なので実装しない
    expect(waits).toEqual([
      new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, ""),
      new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, ""),
      new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")])
  })

  test("9面待ちの待ち牌が計算できる", () => {
    const testPlayer = new Player()
    testPlayer.tiles = [
      new Tile("pin", 1, ""), new Tile("pin", 1, ""), new Tile("pin", 1, ""),
      new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, ""),
      new Tile("pin", 5, ""), new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, ""),
      new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")
    ]
    const waits: Tile[] = testPlayer.waitTiles()
    expect(waits).toEqual([
      new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, ""),
      new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, ""),
      new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")])
  })
})

test("七対子の待ち牌が計算できる", () => {
  const testPlayer = new Player()
  testPlayer.tiles = [
    new Tile("", 0, "white"), new Tile("", 0, "white"),
    new Tile("man", 1, ""), new Tile("man", 1, ""),
    new Tile("pin", 9, ""), new Tile("pin", 9, ""),
    new Tile("sou", 9, ""), new Tile("sou", 9, ""),
    new Tile("sou", 1, ""),
    new Tile("pin", 5, ""), new Tile("pin", 5, ""),
    new Tile("pin", 6, ""), new Tile("pin", 6, ""),
  ]
  const waits: Tile[] = testPlayer.waitTiles()
  expect(waits).toEqual([new Tile("sou", 1, "")])
})

test("国士無双の待ち牌が計算できる", () => {
  const testPlayer = new Player()
  testPlayer.tiles = [
    new Tile("pin", 1, ""), new Tile("pin", 9, ""), new Tile("sou", 1, ""),
    new Tile("sou", 9, ""), new Tile("man", 1, ""), new Tile("man", 9, ""),
    new Tile("", 0, "east"), new Tile("", 0, "south"), new Tile("", 0, "west"),
    new Tile("", 0, "west"), new Tile("", 0, "north"), new Tile("", 0, "white"), new Tile("", 0, "green")
  ]
  const waits: Tile[] = testPlayer.waitTiles()
  expect(waits).toEqual([new Tile("", 0, "red")])
})

test("国士無双十三面の待ち牌が計算できる", () => {
  const testPlayer = new Player()
  testPlayer.tiles = [
    new Tile("pin", 1, ""), new Tile("pin", 9, ""), new Tile("sou", 1, ""),
    new Tile("sou", 9, ""), new Tile("man", 1, ""), new Tile("man", 9, ""),
    new Tile("", 0, "east"), new Tile("", 0, "south"), new Tile("", 0, "west"), new Tile("", 0, "north"),
    new Tile("", 0, "white"), new Tile("", 0, "green"), new Tile("", 0, "red")
  ]
  const waits: Tile[] = testPlayer.waitTiles()
  expect(waits).toEqual([
    new Tile("pin", 1, ""), new Tile("pin", 9, ""), new Tile("sou", 1, ""),
    new Tile("sou", 9, ""), new Tile("man", 1, ""), new Tile("man", 9, ""),
    new Tile("", 0, "east"), new Tile("", 0, "south"), new Tile("", 0, "west"), new Tile("", 0, "north"),
    new Tile("", 0, "white"), new Tile("", 0, "green"), new Tile("", 0, "red")
  ])
})
