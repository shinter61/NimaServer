var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

connections = [];
class Game {
  constructor() {
    this.player1 = ""
    this.player2 = ""
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
    if (game.player1 == playerID) {
      game.player1 = ""
    } else if (game.player2 == playerID) {
      game.player2 = ""
    }
    console.log("player1 ", game.player1)
    console.log("player2 ", game.player2)
    io.sockets.emit('InformPlayersNames', { player1: game.player1, player2: game.player2 })

    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnect: %s sockets are connected', connections.length);
  });

  socket.on('AddPlayer', function(data) {
    if (game.player1 == "") {
      game.player1 = data
    } else if (game.player2 == "") {
      game.player2 = data
    }
    console.log("player1 ", game.player1)
    console.log("player2 ", game.player2)
    io.sockets.emit('InformPlayersNames', { player1: game.player1, player2: game.player2 })
  })
})

