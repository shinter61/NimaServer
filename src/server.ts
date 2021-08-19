import { createServer } from "http"
import { Server, Socket } from "socket.io"
import express from "express"
import { Game } from "./Game"
import { Player } from "./Player"
import { Tile, allTiles } from "./Tile"
import { Winning } from "./Winning"

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
    const player = game.player1.name === playerID ? game.player1 : game.player2
    player.discards.push(tile)
    player.tiles.splice(player.tiles.findIndex(
      el => el.kind == tile.kind && el.number == tile.number && el.character == tile.character
    ), 1)
    player.organizeTile()

    // 聴牌時の待ち牌を知らせる
    const waitTiles: Tile[] = []
    for (let i = 0; i < allTiles.length; i++) {
      const tilesCopy: Tile[] = []
      for (let i = 0; i < player.tiles.length; i++) { tilesCopy.push(player.tiles[i].copy()) }
      player.tiles.push(allTiles[i])
      const winnings: Winning[]  = player.judgeHands()
      if (winnings.length !== 0) { waitTiles.push(allTiles[i]) }
      player.tiles = tilesCopy
    }

    io.sockets.emit('InformDiscards', {
      id: playerID,
      tiles: JSON.stringify(player.tiles),
      discards: JSON.stringify(player.discards),
      waits: JSON.stringify(waitTiles)
    })
    game.player1.name === playerID ? game.player1 = player : game.player2 = player
  })

  socket.on('Draw', function(playerID: string) {
    const tile = game.draw()
    if (tile === undefined) { return }
    const player = game.player1.name === playerID ? game.player1 : game.player2
    player.tiles.push(tile)
    const winnings: Winning[]  = player.judgeHands()
    io.sockets.emit('Draw', {
      id: playerID,
      tiles: JSON.stringify(player.tiles), 
      stockCount: String(game.stock.length),
      isWin: (winnings.length !== 0).toString()
    })
    game.player1.name === playerID ? game.player1 = player : game.player2 = player
  })

  socket.on('Win', function(playerID: string) {
    let hands: string[] = []
    let maxHan = 0
    const player = game.player1.name === playerID ? game.player1 : game.player2
    const winnings: Winning[]  = player.judgeHands()
    for (let i = 0; i < winnings.length; i++) {
      const tmpHan = winnings[i].judgeHands()
      if (tmpHan > maxHan) {
        hands = winnings[i].hands.map(hand => hand.name)
        maxHan = tmpHan
      }
    }
    io.sockets.emit('Win', {
      id: playerID,
      hands: JSON.stringify(hands), 
      score: String(18000),
      scoreName: "跳満"
    })
    game.player1.name === playerID ? game.player1 = player : game.player2 = player
  })
})

