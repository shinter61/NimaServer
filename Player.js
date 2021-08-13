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
}

module.exports = Player
