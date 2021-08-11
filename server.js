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

  socket.on('Discard', function(playerID, discards) {
    if (game.player1.name == playerID) {
      game.player1.discards = discards
    } else if (game.player2.name == playerID) {
      game.player2.discards = discards
    }
    io.sockets.emit('InformDiscards', { id: playerID, discards: discards })
  })
})

