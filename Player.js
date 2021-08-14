class Player {
  constructor() {
    this.name = ""
    this.discards = []
    this.tiles = []
  }

  organizeTile() {
    var pinzuTiles = []
    var souzuTiles = []
    var manzuTiles = []
    var eastTiles = []
    var southTiles = []
    var westTiles = []
    var northTiles = []
    var whiteTiles = []
    var greenTiles = []
    var redTiles = []

    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].kind == "pin") { pinzuTiles.push(this.tiles[i]) }
      else if (this.tiles[i].kind == "sou") { souzuTiles.push(this.tiles[i]) }
      else if (this.tiles[i].kind == "man") { manzuTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "east") { eastTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "south") { southTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "west") { westTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "north") { northTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "white") { whiteTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "green") { greenTiles.push(this.tiles[i]) }
      else if (this.tiles[i].character == "red") { redTiles.push(this.tiles[i]) }
    }

    pinzuTiles.sort(function(a, b) {
      if (a.number < b.number) return -1;
      if (a.number > b.number) return 1;
      return 0;
    })
    manzuTiles.sort(function(a, b) {
      if (a.number < b.number) return -1;
      if (a.number > b.number) return 1;
      return 0;
    })
    souzuTiles.sort(function(a, b) {
      if (a.number < b.number) return -1;
      if (a.number > b.number) return 1;
      return 0;
    })

    this.tiles = [].concat(pinzuTiles, souzuTiles, manzuTiles, eastTiles, southTiles, westTiles, northTiles,
      whiteTiles, greenTiles, redTiles)
  }

  judgeHands() {
    let myTiles = this.tiles.slice()
    let ankoTiles = [],  pinzuAnkoTiles = []
    let mentzTiles = [], jantou = null
    let dupCount = 0, prevTile = { kind: "", number: 0, character: "" }
    for (let i = 0; i < myTiles.length; i++) {
      if (prevTile.kind === myTiles[i].kind &&
        prevTile.number === myTiles[i].number &&
        prevTile.character === myTiles[i].character) {
        dupCount++;
        if (dupCount == 3) { ankoTiles.push(this.tiles[i]) }
      } else {
        dupCount = 1
        prevTile = myTiles[i]
      }
    }

    // 筒子の暗刻を取り出す、それ以外の牌の暗刻は面子としてしか使えないため
    for (let i = 0; i < ankoTiles.length; i++) {
      if (ankoTiles[i].kind === "pin") {
        pinzuAnkoTiles.push(ankoTiles[i])
      } else {
        let index = myTiles.findIndex(tile => tile.kind === ankoTiles[i].kind && tile.number === ankoTiles[i].number
          && tile.character === ankoTiles[i].character)
        let mentz = myTiles.splice(index, 3)
        mentzTiles.push(mentz)
      }
    }

    pinzuAnkoTiles = ankoTiles.filter(tile => tile.kind === "pin")

    // 刻子を雀頭か刻子にするか全パターン検証
    if (pinzuAnkoTiles.length === 0) {
      let tmpMyTiles = myTiles.slice()
      for (let i = 0; i < tmpMyTiles.length; i++) {
        let curNum = tmpMyTiles[i].number
        if (tmpMyTiles[i].kind === "pin" && tmpMyTiles[i+1].kind === "pin" && tmpMyTiles[i+2] === "pin"
          && tmpMyTiles[i+1].number == curNum+1 && tmpMyTiles[i+2].number === curNum+2
        ) {

        }
      }
    }
    let jantouPattern = false
    for (let i = 0; i < pinzuAnkoTiles.length; i++) {
      let tmpMyTiles = myTiles.slice()
      let tmpMentzTiles = mentzTiles.slice()
      if (jantouPattern) {
        jantouPattern = false
      } else {
        jantouPattern = true

        let index = tmpMyTiles.findIndex(tile =>
          tile.kind === pinzuAnkoTiles[i].kind && tile.number === pinzuAnkoTiles[i].number
          && tile.character === pinzuAnkoTiles[i].character)
        let mentz = tmpMyTiles.splice(index, 3)
        tmpMentzTiles.push(mentz)
      }
    }

    console.log('myTiles ', myTiles)
    console.log('ankoTiles ', ankoTiles)
    console.log('pinzuAnkoTiles ', pinzuAnkoTiles)
  }
}

module.exports = Player
