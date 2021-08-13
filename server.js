var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const Game = require('./Game.js')
const Player = require('./Player.js')

connections = [];
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
    io.sockets.emit('InformPlayersNames', { player1: game.player1.name, player2: game.player2.name })

    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnect: %s sockets are connected', connections.length);
    console.log("player1 ", game.player1.name)
    console.log("player2 ", game.player2.name)
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
    game.reload()
    game.player1.organizeTile()
    game.player2.organizeTile()
    let tile = game.draw()
    game.player1.tiles.push(tile)

    let { player1, player2 } = game
    io.sockets.emit('DistributeInitTiles', { id: player1.name, tiles: JSON.stringify(player1.tiles) })
    io.sockets.emit('DistributeInitTiles', { id: player2.name, tiles: JSON.stringify(player2.tiles) })
  })

  socket.on('Discard', function(playerID, tiles) {
    tile = JSON.parse(tiles)[0]
    console.log(tile)
    if (game.player1.name == playerID) {
      game.player1.discards.push(tile)
      game.player1.tiles.splice(game.player1.tiles.findIndex(
        el => el.kind == tile.kind && el.number == tile.number && el.character == tile.character
      ), 1)
      game.player1.organizeTile()
      io.sockets.emit('InformDiscards', {
        id: playerID,
        tiles: JSON.stringify(game.player1.tiles),
        discards: JSON.stringify(game.player1.discards)
      })
    } else if (game.player2.name == playerID) {
      game.player2.discards.push(tile)
      game.player2.tiles.splice(game.player2.tiles.findIndex(
        el => el.kind == tile.kind && el.number == tile.number && el.character == tile.character
      ), 1)
      game.player2.organizeTile()
      io.sockets.emit('InformDiscards', {
        id: playerID,
        tiles: JSON.stringify(game.player2.tiles),
        discards: JSON.stringify(game.player2.discards)
      })
    }
  })

  socket.on('Draw', function(playerID) {
    let tile = game.draw()
    if (game.player1.name == playerID) {
      game.player1.tiles.push(tile)
      io.sockets.emit('Draw', {
        id: playerID,
        tiles: JSON.stringify(game.player1.tiles), 
        stockCount: String(game.stock.length)
      })
    }
    else if (game.player2.name == playerID) {
      game.player2.tiles.push(tile)
      io.sockets.emit('Draw', {
        id: playerID,
        tiles: JSON.stringify(game.player2.tiles), 
        stockCount: String(game.stock.length)
      })
    }
  })
})

