import { Tile } from "../src/Tile"
import { Winning } from "../src/Winning"

describe("立直のテスト", () => {
  test("立直が判定できる", () => {
    const testWin = new Winning([], [], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""), "draw", 9, 12)
    testWin.judgeRiichi()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["立直"])
  })
})

describe("門前清自摸和のテスト", () => {
  test("門前清自摸和が判定できる", () => {
    const testWin = new Winning([], [], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgeTsumo()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["門前清自摸和"])
  })
})

describe("平和のテスト", () => {
  test("門前で平和が判定できる", () => {
    const testWin = new Winning([], [], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgePinfu()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["平和"])
  })

  test("鳴くと平和がつかない", () => {
    const testWin = new Winning([], [
      [new Tile("pin", 2, ""), new Tile("pin", 2, ""), new Tile("pin", 2, "")],
    ], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgePinfu()
    expect(testWin.hands.map(hand => hand.name)).toEqual([])
  })
})

describe("断么九のテスト", () => {
  test("鳴きありで断么九が判定できる", () => {
    const testWin = new Winning([[new Tile("pin", 5, ""), new Tile("pin", 5, ""), new Tile("pin", 5, "")]], [
      [new Tile("pin", 2, ""), new Tile("pin", 2, ""), new Tile("pin", 2, "")],
    ], [
      [new Tile("pin", 3, ""), new Tile("pin", 4, ""), new Tile("pin", 5, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    ], [new Tile("pin", 2, ""), new Tile("pin", 2, "")], [], [], new Tile("pin", 5, ""), "draw", -1, 6)
    testWin.judgeTanyao()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["断么九"])
  })
})

describe("一盃口のテスト", () => {
  test("一盃口が判定できる", () => {
    const testWin = new Winning([[new Tile("pin", 5, ""), new Tile("pin", 5, ""), new Tile("pin", 5, "")]], [], [
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 5, ""), "draw", -1, 6)
    testWin.judgeIpeko()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["一盃口"])
  })
})

describe("役牌のテスト", () => {
  test("鳴きありで役牌が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")]
    ], [
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
    ], [
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.judgeYakuhai()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["役牌: 白","役牌: 發"])
  })
})

describe("場風牌のテスト", () => {
  test("鳴きあり場風牌が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
    ], [
      [new Tile("", 0, "south"), new Tile("", 0, "south"), new Tile("", 0, "south")]
    ], [
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.roundWind = "south"
    testWin.judgeBakaze()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["場風牌: 南"])
  })
})

describe("自風牌のテスト", () => {
  test("鳴きあり自風牌が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
    ], [
      [new Tile("", 0, "south"), new Tile("", 0, "south"), new Tile("", 0, "south")]
    ], [
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.isParent = false
    testWin.judgeJikaze()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["自風牌: 南"])
  })
})

describe("ドラのテスト", () => {
  test("ドラが判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
    ], [
      [new Tile("", 0, "south"), new Tile("", 0, "south"), new Tile("", 0, "south")]
    ], [
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.doras = [new Tile("pin", 6, "")]
    testWin.judgeDora()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["ドラ1"])
  })
})

describe("裏ドラのテスト", () => {
  test("裏ドラが判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
    ], [
      [new Tile("", 0, "south"), new Tile("", 0, "south"), new Tile("", 0, "south")]
    ], [
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", 10, 6)
    testWin.revDoras = [new Tile("sou", 9, "")]
    testWin.judgeRevDora()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["裏ドラ2"])
  })
})

describe("ダブル立直のテスト", () => {
  test("ダブル立直が判定できる", () => {
    const testWin = new Winning([], [], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""), "draw", 1, 6)
    testWin.judgeDoubleRiichi()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["ダブル立直"])
  })

  test("立直と複合しない", () => {
    const testWin = new Winning([], [], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""), "draw", 1, 6)
    testWin.judgeRiichi()
    testWin.judgeDoubleRiichi()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["ダブル立直"])
  })
})

describe("混全帯么九のテスト", () => {
  test("門前で混全帯么九が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
    ], [], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.judgeChanta()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["混全帯么九"])
    expect(testWin.hands.map(hand => hand.han)).toEqual([2])
  })

  test("鳴きありでで混全帯么九が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
    ], [
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
    ], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.judgeChanta()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["混全帯么九"])
    expect(testWin.hands.map(hand => hand.han)).toEqual([1])
  })
})

describe("混老頭のテスト", () => {
  test("混老頭が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
    ], [
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
    ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.judgeHonroto()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["混老頭"])
  })
})

describe("一気通貫のテスト", () => {
  test("門前で一気通貫が判定できる", () => {
    const testWin = new Winning([[new Tile("pin", 5, ""), new Tile("pin", 5, ""), new Tile("pin", 5, "")]],[],  [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 5, ""), "draw", -1, 6)
    testWin.judgeIttsu()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["一気通貫"])
    expect(testWin.hands.map(hand => hand.han)).toEqual([2])
  })

  test("鳴きありで一気通貫が判定できる", () => {
    const testWin = new Winning([], [[new Tile("pin", 5, ""), new Tile("pin", 5, ""), new Tile("pin", 5, "")]], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 5, ""), "draw", -1, 6)
    testWin.judgeIttsu()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["一気通貫"])
    expect(testWin.hands.map(hand => hand.han)).toEqual([1])
  })
})

describe("対々和のテスト", () => {
  test("鳴きありで対々和が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
    ], [
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")],
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.judgeToiToi()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["対々和"])
  })
})

describe("三暗刻のテスト", () => {
  test("鳴きあり、自摸あがりで三暗刻が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")],
    ], [
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("", 0, "green"), "draw", -1, 6)
    testWin.judgeSananko()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["三暗刻"])
  })

  test("鳴きあり、ロンあがりで三暗刻が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")],
    ], [
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "ron", -1, 6)
    testWin.judgeSananko()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["三暗刻"])
  })
})

describe("三色同刻のテスト", () => {
  test("鳴きありで三色同刻が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("man", 9, ""), new Tile("man", 9, ""), new Tile("man", 9, "")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
    ], [
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")]
    ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.judgeSansyoku()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["三色同刻"])
  })
})

describe("七対子のテスト", () => {
  test("七対子が判定できる", () => {
    const testWin = new Winning([], [], [], [], [
      [new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("man", 1, ""), new Tile("man", 1, "")],
      [new Tile("pin", 9, ""), new Tile("pin", 9, "")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, "")],
      [new Tile("sou", 1, ""), new Tile("sou", 1, "")],
      [new Tile("pin", 5, ""), new Tile("pin", 5, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 6, "")],
    ], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.judgeChiitoi()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["七対子"])
  })
})

describe("小三元のテスト", () => {
  test("鳴きありで小三元が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
    ], [
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")]
    ], [], [new Tile("", 0, "red"), new Tile("", 0, "red")], [], [], new Tile("sou", 9, ""), "draw", -1, 6)
    testWin.judgeShosangen()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["小三元"])
  })
})

describe("混一色のテスト", () => {
  test("門前で混一色が判定できる", () => {
    const testWin = new Winning([], [], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("", 0, "green"), new Tile("", 0, "green")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgeHonitsu()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["混一色"])
    expect(testWin.hands.map(hand => hand.han)).toEqual([3])
  })
  
  test("鳴きありで混一色が判定できる", () => {
    const testWin = new Winning([], [
      [new Tile("pin", 2, ""), new Tile("pin", 2, ""), new Tile("pin", 2, "")],
    ], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("", 0, "green"), new Tile("", 0, "green")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgeHonitsu()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["混一色"])
    expect(testWin.hands.map(hand => hand.han)).toEqual([2])
  })
})

describe("二盃口のテスト", () => {
  test("二盃口が判定できる", () => {
    const testWin = new Winning([], [], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("", 0, "green"), new Tile("", 0, "green")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgeRyanpeko()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["二盃口"])
  })
})

describe("純全帯么九のテスト", () => {
  test("門前の純全帯么九が判定できる", () => {
    const testWin = new Winning([
      [new Tile("man", 9, ""), new Tile("man", 9, ""), new Tile("man", 9, "")],
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")]
    ], [], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.judgeJunchan()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["純全帯么九"])
    expect(testWin.hands.map(hand => hand.han)).toEqual([3])
  })

  test("鳴きありの純全帯么九が判定できる", () => {
    const testWin = new Winning([
      [new Tile("man", 9, ""), new Tile("man", 9, ""), new Tile("man", 9, "")],
    ], [
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")]
    ], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "draw", -1, 6)
    testWin.judgeJunchan()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["純全帯么九"])
    expect(testWin.hands.map(hand => hand.han)).toEqual([2])
  })
})

describe("清一色のテスト", () => {
  test("門前の清一色が判定できる", () => {
    const testWin = new Winning([
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")]
    ], [], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("pin", 5, ""), new Tile("pin", 5, "")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgeChinitsu()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["清一色"])
    expect(testWin.hands.map(hand => hand.han)).toEqual([6])
  })

  test("鳴きありの清一色が判定できる", () => {
    const testWin = new Winning([], [
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")]
    ], [
      [new Tile("pin", 1, ""), new Tile("pin", 2, ""), new Tile("pin", 3, "")],
      [new Tile("pin", 6, ""), new Tile("pin", 7, ""), new Tile("pin", 8, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("pin", 5, ""), new Tile("pin", 5, "")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgeChinitsu()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["清一色"])
    expect(testWin.hands.map(hand => hand.han)).toEqual([5])
  })
})

describe("大三元のテスト", () => {
  test("大三元が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
    ], [
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")],
      [new Tile("", 0, "red"), new Tile("", 0, "red"), new Tile("", 0, "red")],
    ], [], [new Tile("pin", 5, ""), new Tile("pin", 5, "")], [], [], new Tile("sou", 9, ""), "draw", -1, 6)
    testWin.judgeDaisangen()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["大三元"])
  })
})

describe("小四喜のテスト", () => {
  test("小四喜が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "east"), new Tile("", 0, "east"), new Tile("", 0, "east")],
      [new Tile("", 0, "north"), new Tile("", 0, "north"), new Tile("", 0, "north")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
    ], [
      [new Tile("", 0, "south"), new Tile("", 0, "south"), new Tile("", 0, "south")],
    ], [], [new Tile("", 0, "west"), new Tile("", 0, "west")], [], [], new Tile("sou", 9, ""), "draw", -1, 6)
    testWin.judgeShosushi()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["小四喜"])
  })
})

describe("大四喜のテスト", () => {
  test("大四喜が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "east"), new Tile("", 0, "east"), new Tile("", 0, "east")],
      [new Tile("", 0, "north"), new Tile("", 0, "north"), new Tile("", 0, "north")],
    ], [
      [new Tile("", 0, "south"), new Tile("", 0, "south"), new Tile("", 0, "south")],
      [new Tile("", 0, "west"), new Tile("", 0, "west"), new Tile("", 0, "west")],
    ], [], [new Tile("pin", 5, ""), new Tile("pin", 5, "")], [], [], new Tile("", 0, "west"), "draw", -1, 6)
    testWin.judgeDaisushi()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["大四喜"])
  })
})

describe("四暗刻のテスト", () => {
  test("四暗刻が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")],
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    ], [], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("", 0, "green"), "draw", -1, 6)
    testWin.judgeSuanko()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["四暗刻"])
  })

  test("四暗刻単騎が判定できる", () => {
    const testWin = new Winning([
      [new Tile("", 0, "white"), new Tile("", 0, "white"), new Tile("", 0, "white")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
      [new Tile("", 0, "green"), new Tile("", 0, "green"), new Tile("", 0, "green")],
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    ], [], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("sou", 1, ""), "ron", -1, 6)
    testWin.judgeSuanko()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["四暗刻単騎"])
  })
})

describe("清老頭のテスト", () => {
  test("清老頭が判定できる", () => {
    const testWin = new Winning([
      [new Tile("pin", 1, ""), new Tile("pin", 1, ""), new Tile("pin", 1, "")],
      [new Tile("sou", 9, ""), new Tile("sou", 9, ""), new Tile("sou", 9, "")],
    ], [
      [new Tile("man", 9, ""), new Tile("man", 9, ""), new Tile("man", 9, "")],
      [new Tile("pin", 9, ""), new Tile("pin", 9, ""), new Tile("pin", 9, "")],
    ], [], [new Tile("sou", 1, ""), new Tile("sou", 1, "")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgeChinroto()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["清老頭"])
  })
})

describe("国士無双のテスト", () => {
  test("国士無双が判定できる", () => {
    const testWin = new Winning([], [], [], [], [], [
      new Tile("pin", 1, ""), new Tile("pin", 9, ""), new Tile("sou", 1, ""),
      new Tile("sou", 9, ""), new Tile("man", 1, ""), new Tile("man", 9, ""),
      new Tile("", 0, "east"), new Tile("", 0, "south"), new Tile("", 0, "west"),
      new Tile("", 0, "west"), new Tile("", 0, "white"), new Tile("", 0, "green"), new Tile("", 0, "red")
    ], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgeKokushi()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["国士無双"])
  })

  test("国士無双十三面が判定できる", () => {
    const testWin = new Winning([], [], [], [], [], [
      new Tile("pin", 1, ""), new Tile("pin", 9, ""), new Tile("sou", 1, ""),
      new Tile("sou", 9, ""), new Tile("man", 1, ""), new Tile("man", 9, ""),
      new Tile("", 0, "east"), new Tile("", 0, "south"), new Tile("", 0, "west"),
      new Tile("", 0, "west"), new Tile("", 0, "white"), new Tile("", 0, "green"), new Tile("", 0, "red")
    ], new Tile("", 0, "west"), "draw", -1, 6)
    testWin.judgeKokushi()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["国士無双十三面"])
  })
})

describe("九蓮宝燈のテスト", () => {
  test("九蓮宝燈が判定できる", () => {
    const testWin = new Winning([[new Tile("pin", 1, ""), new Tile("pin", 1, ""), new Tile("pin", 1, "")]], [], [
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("pin", 9, ""), new Tile("pin", 9, "")], [], [], new Tile("pin", 1, ""), "draw", -1, 6)
    testWin.judgeChuren()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["九蓮宝燈"])
  })

  test("純正九蓮宝燈が判定できる", () => {
    const testWin = new Winning([[new Tile("pin", 1, ""), new Tile("pin", 1, ""), new Tile("pin", 1, "")]], [], [
      [new Tile("pin", 2, ""), new Tile("pin", 3, ""), new Tile("pin", 4, "")],
      [new Tile("pin", 4, ""), new Tile("pin", 5, ""), new Tile("pin", 6, "")],
      [new Tile("pin", 7, ""), new Tile("pin", 8, ""), new Tile("pin", 9, "")],
    ], [new Tile("pin", 9, ""), new Tile("pin", 9, "")], [], [], new Tile("pin", 4, ""), "draw", -1, 6)
    testWin.judgeChuren()
    expect(testWin.hands.map(hand => hand.name)).toEqual(["純正九蓮宝燈"])
  })
})
