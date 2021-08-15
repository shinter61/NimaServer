import { createServer } from "http"
import { Server, Socket } from "socket.io"
import { Game } from "./Game"
import { Player } from "./Player"
import { Tile } from "./Tile"
import express from "express"

const app: express.Express = express();
const server = createServer(app);
const io = new Server(server);

const connections: Socket[] = [];
const game = new Game();

server.listen(process.env.PORT || 3000);
console.log('Server is running...');

io.sockets.on('connection', function(socket: Socket) {
  connections.push(socket)
  console.log('Connect: %s sockets are connected', connections.length);

  // Disconnect
  socket.on('disconnect', function() {
    const playerID: string = socket.handshake.auth.name as string
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

  socket.on('AddPlayer', function(data: string) {
    if (game.player1.name == "") {
      game.player1.name = data
    } else if (game.player2.name == "") {
      game.player2.name = data
    }
    console.log("player1 ", game.player1.name)
    console.log("player2 ", game.player2.name)
    io.sockets.emit('InformPlayersNames', { player1: game.player1.name, player2: game.player2.name })
  })

  socket.on('StartGame', function() {
    game.reload()
    game.player1.organizeTile()
    game.player2.organizeTile()
    const tile = game.draw()
    if (tile !== undefined) { game.player1.tiles.push(tile) }

    const { player1, player2 } = game
    io.sockets.emit('DistributeInitTiles', { id: player1.name, tiles: JSON.stringify(player1.tiles) })
    io.sockets.emit('DistributeInitTiles', { id: player2.name, tiles: JSON.stringify(player2.tiles) })
  })

  socket.on('Discard', function(playerID: string, tiles: string) {
    const tile = (JSON.parse(tiles) as Tile[])[0]
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

  socket.on('Draw', function(playerID: string) {
    const tile = game.draw()
    if (tile === undefined) { return }
    if (game.player1.name == playerID) {
      game.player1.tiles.push(tile)
      const isWin = game.player1.judgeHands()
      io.sockets.emit('Draw', {
        id: playerID,
        tiles: JSON.stringify(game.player1.tiles), 
        stockCount: String(game.stock.length),
        isWin: isWin.toString()
      })
    }
    else if (game.player2.name == playerID) {
      game.player2.tiles.push(tile)
      const isWin = game.player2.judgeHands()
      io.sockets.emit('Draw', {
        id: playerID,
        tiles: JSON.stringify(game.player2.tiles), 
        stockCount: String(game.stock.length),
        isWin: isWin.toString()
      })
    }
  })
})

