import { Tile } from "../src/Tile"
import { Winning } from "../src/Winning"

test("平和が判定できるか", () => {
  const testWin = new Winning([], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""))
  testWin.judgePinfu()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["平和"])
})

test("断么九が判定できるか", () => {
  const testWin = new Winning([[new Tile("pin", 5, ""), new Tile("pin", 5, ""), new Tile("pin", 5, "")]], [
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 5, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
  ], [new Tile("pin", 2, ""), new Tile("pin", 2, "")], [], [], new Tile("pin", 5, ""))
  testWin.judgeTanyao()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["断么九"])
})

test("一盃口が判定できるか", () => {
  const testWin = new Winning([[new Tile("pin", 5, ""), new Tile("pin", 5, ""), new Tile("pin", 5, "")]], [
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
  ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 5, ""))
  testWin.judgeIpeko()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["一盃口"])
})

test("役牌が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
    [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
  ], [
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
  ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""))
  testWin.judgeYakuhai()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["役牌: 白","役牌: 發"])
})

test("混全帯么九が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
    [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
  ], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""))
  testWin.judgeChanta()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["混全帯么九"])
})

test("混老頭が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
    [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")],
    [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
  ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""))
  testWin.judgeHonroto()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["混老頭"])
})

test("一気通貫が判定できるか", () => {
  const testWin = new Winning([[new Tile("pin", 5, ""), new Tile("pin", 5, ""), new Tile("pin", 5, "")]], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 5, ""))
  testWin.judgeIttsu()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["一気通貫"])
})

test("対々和が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
    [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")],
    [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
  ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""))
  testWin.judgeToiToi()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["対々和"])
})

test("三色同刻が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
    [new Tile("man", 9, ""), new Tile("man", 9, ""), new Tile("man", 9, "")],
    [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
  ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""))
  testWin.judgeSansyoku()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["三色同刻"])
})

test("七対子が判定できるか", () => {
  const testWin = new Winning([], [], [], [
    [new Tile("", 0, "white"), new Tile("", 0, "white")],
    [new Tile("man", 1, ""), new Tile("man", 1, "")],
    [new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    [new Tile("sou", 9, ""), new Tile("sou", 9, "")],
    [new Tile("sou", 1, ""), new Tile("sou", 1, "")],
    [new Tile("pin", 5, ""), new Tile("pin", 5, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 6, "")],
  ], [], new Tile("sou", 1, ""))
  testWin.judgeChiitoi()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["七対子"])
})

test("小三元が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
    [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")],
    [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
  ], [], [new Tile("", 0, "red"), new Tile("", 0, "red")], [], [], new Tile("sou", 9, ""))
  testWin.judgeShosangen()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["小三元"])
})

test("混一色が判定できるか", () => {
  const testWin = new Winning([], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [new Tile("", 0, "green"), new Tile("", 0, "green")], [], [], new Tile("pin", 1, ""))
  testWin.judgeHonitsu()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["混一色"])
})

test("二盃口が判定できるか", () => {
  const testWin = new Winning([], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [new Tile("", 0, "green"), new Tile("", 0, "green")], [], [], new Tile("pin", 1, ""))
  testWin.judgeRyanpeko()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["二盃口"])
})

test("純全帯么九が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("man", 9, ""), new Tile("man", 9, ""), new Tile("man", 9, "")],
    [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")]
  ], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""))
  testWin.judgeJunchan()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["純全帯么九"])
})

test("清一色が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")]
  ], [
    [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
    [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [new Tile("pin", 5, ""), new Tile("pin", 5, "")], [], [], new Tile("pin", 1, ""))
  testWin.judgeChinitsu()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["清一色"])
})

test("大三元が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
    [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")],
    [new Tile("", 0, "red"), new Tile("", 0, "red"), new Tile("", 0, "red")],
    [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
  ], [], [new Tile("pin", 5, ""), new Tile("pin", 5, "")], [], [], new Tile("sou", 9, ""))
  testWin.judgeDaisangen()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["大三元"])
})

test("小四喜が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("", 0, "east"), new Tile("", 0, "east"), new Tile("", 0, "east")],
    [new Tile("", 0, "north"), new Tile("", 0, "north"), new Tile("", 0, "north")],
    [new Tile("", 0, "south"), new Tile("", 0, "south"), new Tile("", 0, "south")],
    [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
  ], [], [new Tile("", 0, "west"), new Tile("", 0, "west")], [], [], new Tile("sou", 9, ""))
  testWin.judgeShosushi()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["小四喜"])
})

test("大四喜が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("", 0, "east"), new Tile("", 0, "east"), new Tile("", 0, "east")],
    [new Tile("", 0, "north"), new Tile("", 0, "north"), new Tile("", 0, "north")],
    [new Tile("", 0, "south"), new Tile("", 0, "south"), new Tile("", 0, "south")],
    [new Tile("", 0, "west"), new Tile("", 0, "west"), new Tile("", 0, "west")],
  ], [], [new Tile("pin", 5, ""), new Tile("pin", 5, "")], [], [], new Tile("", 0, "west"))
  testWin.judgeDaisushi()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["大四喜"])
})

test("清老頭が判定できるか", () => {
  const testWin = new Winning([
    [new Tile("pin", 1, ""), new Tile("pin", 1, ""), new Tile("pin", 1, "")],
    [new Tile("man", 9, ""), new Tile("man", 9, ""), new Tile("man", 9, "")],
    [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
  ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""))
  testWin.judgeChinroto()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["清老頭"])
})

test("国士無双が判定できるか", () => {
  const testWin = new Winning([], [], [], [], [
    new Tile("pin", 1, ""), new Tile("pin", 9, ""), new Tile("sou", 1, ""),
    new Tile("sou", 9, ""), new Tile("man", 1, ""), new Tile("man", 9, ""),
    new Tile("", 0, "east"), new Tile("", 0, "south"), new Tile("", 0, "west"),
    new Tile("", 0, "west"), new Tile("", 0, "white"), new Tile("", 0, "green"), new Tile("", 0, "red")
  ], new Tile("pin", 1, ""))
  testWin.judgeKokushi()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["国士無双"])
})

test("国士無双十三面が判定できるか", () => {
  const testWin = new Winning([], [], [], [], [
    new Tile("pin", 1, ""), new Tile("pin", 9, ""), new Tile("sou", 1, ""),
    new Tile("sou", 9, ""), new Tile("man", 1, ""), new Tile("man", 9, ""),
    new Tile("", 0, "east"), new Tile("", 0, "south"), new Tile("", 0, "west"),
    new Tile("", 0, "west"), new Tile("", 0, "white"), new Tile("", 0, "green"), new Tile("", 0, "red")
  ], new Tile("", 0, "west"))
  testWin.judgeKokushi()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["国士無双十三面"])
})

test("九蓮宝燈が判定できるか", () => {
  const testWin = new Winning([[new Tile("pin", 1, ""), new Tile("pin", 1, ""), new Tile("pin", 1, "")]], [
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [new Tile("pin", 9, ""), new Tile("pin", 9, "")], [], [], new Tile("pin", 1, ""))
  testWin.judgeChuren()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["九蓮宝燈"])
})

test("純正九蓮宝燈が判定できるか", () => {
  const testWin = new Winning([[new Tile("pin", 1, ""), new Tile("pin", 1, ""), new Tile("pin", 1, "")]], [
    [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
    [new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, "")],
    [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
  ], [new Tile("pin", 9, ""), new Tile("pin", 9, "")], [], [], new Tile("pin", 4, ""))
  testWin.judgeChuren()
  expect(testWin.hands.map(hand => hand.name)).toEqual(["純正九蓮宝燈"])
})
