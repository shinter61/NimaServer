var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

connections = [];
class Player {
  constructor() {
    this.name = ""
    this.discards = ""
  }
}
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

    return { player1Tiles, player2Tiles }
  }
}
var game = new Game();

server.listen(process.env.PORT || 3000);
console.log('Server is running...');

io.sockets.on('connection', function(socket) {
  connections.push(socket)
  console.log('Connect: %s sockets are connected', connections.length);

  // Disconnect
  socket.on('disconnect', function(data) {
    let playerID = socket.handshake.auth.name
    if (game.player1.name == playerID) {
      game.player1 = new Player()
    } else if (game.player2.name == playerID) {
      game.player2 = new Player()
    }
    console.log("player1 ", game.player1.name)
    console.log("player2 ", game.player2.name)
    io.sockets.emit('InformPlayersNames', { player1: game.player1.name, player2: game.player2.name })

    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnect: %s sockets are connected', connections.length);
  });

  socket.on('AddPlayer', function(data) {
    if (game.player1.name == "") {
      game.player1.name = data
    } else if (game.player2.name == "") {
      game.player2.name = data
    }
    console.log("player1 ", game.player1.name)
    console.log("player2 ", game.player2.name)
    io.sockets.emit('InformPlayersNames', { player1: game.player1.name, player2: game.player2.name })
  })

  socket.on('StartGame', function(data) {
    let { player1Tiles, player2Tiles } = game.reload()
    io.sockets.emit('DistributeInitTiles', { id: game.player1.name, tiles: JSON.stringify(player1Tiles) })
    io.sockets.emit('DistributeInitTiles', { id: game.player2.name, tiles: JSON.stringify(player2Tiles) })
  })

  socket.on('Discard', function(playerID, discards) {
    if (game.player1.name == playerID) {
      game.player1.discards = discards
    } else if (game.player2.name == playerID) {
      game.player2.discards = discards
    }
    io.sockets.emit('InformDiscards', { id: playerID, discards: discards })
  })

  socket.on('InformStock', function(stock) {
    io.sockets.emit('InformStock', { stock })
  })
})

