import { Tile } from "../src/Tile"
import { Winning } from "../src/Winning"

test("七対子の符が計算できる", () => {
  const testWin = new Winning([], [], [], [], [], [], [
    [new Tile("", 0, "white"), new Tile("", 0, "white")],
    [new Tile("man", 1, ""), new Tile("man", 1, "")],
    [new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    [new Tile("sou", 9, ""), new Tile("sou", 9, "")],
    [new Tile("sou", 1, ""), new Tile("sou", 1, "")],
    [new Tile("pin", 5, ""), new Tile("pin", 5, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 6, "")],
  ], [], new Tile("sou", 1, ""), "draw", -1, 6)
  const fu = testWin.calcFu()
  expect(fu).toBe(25)
})

test("門前ツモの平和の符が計算できる", () => {
  const testWin = new Winning([], [], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
  testWin.judgeHands()
  const fu = testWin.calcFu()
  expect(fu).toBe(20)
})

test("門前ロンの符が計算できる", () => {
  const testWin = new Winning([], [], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""), "ron", -1, 6)
  const fu = testWin.calcFu()
  expect(fu).toBe(30)
})

test("暗刻,明刻ありの符が計算できる", () => {
  const testWin = new Winning([
    [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
  ], [
    [new Tile("", 0, "red"), new Tile("", 0, "red"), new Tile("", 0, "red")],
  ], [
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 2, ""), "ron", -1, 6)
  const fu = testWin.calcFu()
  expect(fu).toBe(40)
})

test("暗槓の符が計算できる", () => {
  const testWin = new Winning([], [], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [
    [new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")]
  ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 3, ""), "ron", -1, 6)
  const fu = testWin.calcFu()
  expect(fu).toBe(70)
})

test("明槓の符が計算できる", () => {
  const testWin = new Winning([], [], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [], [
    [new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, ""), new Tile("man", 1, "")]
  ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 3, ""), "ron", -1, 6)
  const fu = testWin.calcFu()
  expect(fu).toBe(40)
})

test("雀頭が役牌の符が計算できる", () => {
  const testWin = new Winning([], [], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [], [], [new Tile("", 0, "white"), new Tile("", 0, "white")], [], [], new Tile("pin", 1, ""), "ron", -1, 6)
  const fu = testWin.calcFu()
  expect(fu).toBe(40)
})

test("辺張待ちの符が計算できる", () => {
  const testWin = new Winning([], [], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 3, ""), "ron", -1, 6)
  const fu = testWin.calcFu()
  expect(fu).toBe(40)
})

test("嵌張待ちの符が計算できる", () => {
  const testWin = new Winning([], [], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 8, ""), "ron", -1, 6)
  const fu = testWin.calcFu()
  expect(fu).toBe(40)
})

test("単騎待ちの符が計算できる", () => {
  const testWin = new Winning([], [], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "ron", -1, 6)
  const fu = testWin.calcFu()
  expect(fu).toBe(40)
})
