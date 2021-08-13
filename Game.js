const Player = require('./Player.js')

class Game {
  constructor() {
    this.player1 = new Player()
    this.player2 = new Player()
    this.stock = []
  }

  reload() {
    this.stock = []

    let characters = ["east", "south", "west", "north", "white", "green", "red"]
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let kinds = ["pin", "sou", "man"]
    for (let i = 0; i < characters.length; i++) {
      for (let j = 0; j < 4; j++) {
        this.stock.push({ kind: "", number: 0, character: characters[i] })
      }
    }
    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < kinds.length; j++) {
        if (numbers[i] >= 2 && numbers[i] <= 8 && kinds[j] != "pin") { continue }
        for (let k = 0; k < 4; k++) {
          this.stock.push({ kind: kinds[j], number: numbers[i], character: "" })
        }
      }
    }

    // shuffle
    for (let i = this.stock.length - 1; i > 0; i--) {
      let r = Math.floor(Math.random() * (i+1))
      let tmp = this.stock[i]
      this.stock[i] = this.stock[r]
      this.stock[r] = tmp
    }

    let player1Tiles = this.stock.splice(0, 13)
    let player2Tiles = this.stock.splice(0, 13)
    console.log('stock count ', this.stock.length)

    this.player1.tiles = player1Tiles
    this.player2.tiles = player2Tiles
  }

  draw() { return this.stock.shift() }
}

module.exports = Game
