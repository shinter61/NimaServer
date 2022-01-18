import { Game } from "../src/Game"
import { Player } from "../src/Player"
import { Tile } from "../src/Tile"

describe("ゲーム終了条件のテスト", () => {
  const game = new Game;

  beforeEach(() => {
    const player1 = new Player
    const player2 = new Player
    game.player1 = player1
    game.player2 = player2
    game.player1.id = 1
    game.player2.id = 2
    game.player1.score = 35000
    game.player1.tiles = []
    game.player2.score = 35000
    game.player2.tiles = []
    game.roundWind = "south"
    game.round = 2
    game.isEnd = false
  })

  test("南2局以外の時はゲームを終了しない", () => {
    game.round = 1
    game.roundWind = "east"

    game.judgeEndGame(-1)
    expect(game.isEnd).toBe(false)
  })

  test("南2局で子が和了した時はゲームを終了する", () => {
    game.judgeEndGame(1)
    expect(game.isEnd).toBe(true)
  })

  test("南2局で親が和了して子より点数が高い時はゲームを終了する", () => {
    game.player2.score = 50000

    game.judgeEndGame(2)
    expect(game.isEnd).toBe(true)
  })

  test("南2局で親がノーテンの時はゲームを終了する", () => {
    game.judgeEndGame(-1)
    expect(game.isEnd).toBe(true)
  })

  test("南2局で親が聴牌で子より点数が高い時はゲームを終了する", () => {
    game.player2.score = 50000
    game.player2.tiles = [
      new Tile("sou", 2, ""), new Tile("sou", 2, ""),
      new Tile("sou", 3, ""), new Tile("sou", 3, ""), new Tile("sou", 4, ""),
      new Tile("sou", 4, ""), new Tile("sou", 5, ""), new Tile("sou", 6, ""),
      new Tile("sou", 7, ""), new Tile("sou", 8, ""), new Tile("sou", 9, ""),
      new Tile("man", 1, ""), new Tile("man", 1, "")
    ]
    game.judgeEndGame(-1)
    expect(game.isEnd).toBe(true)
  })

  test("点数が箱下の時はゲームを終了する", () => {
    game.player1.score = -10000

    game.judgeEndGame(-1)
    expect(game.isEnd).toBe(true)
  })
})
