import { calcRate } from "../src/routes/users"

test("レートの差が0の場合、レート増減が計算できる", () => {
  expect(calcRate(1000, 1000)).toEqual(8)
  expect(calcRate(1000, 1000)).toEqual(8)
})

test("レートの差が50の場合、レート増減が計算できる", () => {
  expect(calcRate(1025, 975)).toEqual(7)
  expect(calcRate(975, 1025)).toEqual(9)
})

test("レートの差が100の場合、レート増減が計算できる", () => {
  expect(calcRate(1050, 950)).toEqual(6)
  expect(calcRate(950, 1050)).toEqual(10)
})

test("レートの差が150の場合、レート増減が計算できる", () => {
  expect(calcRate(1050, 900)).toEqual(5)
  expect(calcRate(900, 1050)).toEqual(11)
})

test("レートの差が200の場合、レート増減が計算できる", () => {
  expect(calcRate(1100, 900)).toEqual(4)
  expect(calcRate(900, 1100)).toEqual(12)
})

test("レートの差が250の場合、レート増減が計算できる", () => {
  expect(calcRate(1150, 900)).toEqual(3)
  expect(calcRate(900, 1150)).toEqual(13)
})

test("レートの差が300の場合、レート増減が計算できる", () => {
  expect(calcRate(1150, 850)).toEqual(2)
  expect(calcRate(850, 1150)).toEqual(14)
})

test("レートの差が500の場合、レート増減が計算できる", () => {
  expect(calcRate(1250, 750)).toEqual(1)
  expect(calcRate(750, 1250)).toEqual(15)
})

test("レートの差が700の場合、レート増減が計算できる", () => {
  expect(calcRate(1350, 650)).toEqual(0)
  expect(calcRate(650, 1350)).toEqual(16)
})

test("レートの差が900の場合、レート増減が計算できる", () => {
  expect(calcRate(1450, 550)).toEqual(0)
  expect(calcRate(550, 1450)).toEqual(16)
})

test("レートの差が2000の場合、レート増減が計算できる", () => {
  expect(calcRate(2000, 0)).toEqual(0)
  expect(calcRate(0, 2000)).toEqual(16)
})
