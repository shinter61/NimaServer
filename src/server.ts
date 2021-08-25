import { createServer } from "http"
import { Server, Socket } from "socket.io"
import express from "express"
import { Game } from "./Game"
import { Player } from "./Player"
import { Tile } from "./Tile"
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
    game.player1.turn += 1

    if (game.isEnd) {
      const winner: Player = game.player1.score >= game.player2.score ? game.player1 : game.player2
      const loser: Player = game.player1.score < game.player2.score ? game.player1 : game.player2
      io.sockets.emit('EndGame', {
        winnerID: winner.name,
        winnerScore: String(winner.score),
        loserID: loser.name,
        loserScore: String(loser.score)
      })
    } else {
      const { player1, player2 } = game
      io.sockets.emit('DistributeInitTiles', {
        id: player1.name,
        tiles: JSON.stringify(player1.tiles),
        score: String(player1.score),
        round: String(game.round),
        roundWind: game.roundWind,
        isParent: (game.round === 1).toString(),
        doraTiles: JSON.stringify(game.doraTiles)
      })
      io.sockets.emit('DistributeInitTiles', {
        id: player2.name,
        tiles: JSON.stringify(player2.tiles),
        score: String(player2.score),
        round: String(game.round),
        roundWind: game.roundWind,
        isParent: (game.round === 2).toString(),
        doraTiles: JSON.stringify(game.doraTiles)
      })
    }
  })

  socket.on('Discard', function(playerID: string, tiles: string, isRiichi: boolean) {
    const tileObj = (JSON.parse(tiles) as Tile[])[0]
    const discardTile = new Tile(tileObj.kind, tileObj.number, tileObj.character)
    const player = game.player1.name === playerID ? game.player1 : game.player2
    player.discards.push(discardTile)
    player.tiles.splice(player.tiles.findIndex(el => el.isEqual(discardTile)), 1)
    player.organizeTile()

    // 立直関連
    if (player.riichiTurn === -1 && isRiichi) {
      player.riichiTurn = player.turn
    }

    // 聴牌時の待ち牌を知らせる
    const waitTiles: Tile[] = player.waitTiles()

    io.sockets.emit('InformDiscards', {
      id: playerID,
      tiles: JSON.stringify(player.tiles),
      discards: JSON.stringify(player.discards),
      waits: JSON.stringify(waitTiles),
      riichiTurn: String(player.riichiTurn)
    })
    game.player1.name === playerID ? game.player1 = player : game.player2 = player
  })

  socket.on('Draw', function(playerID: string) {
    const tile = game.draw()
    if (tile === undefined) { return }
    const player = game.player1.name === playerID ? game.player1 : game.player2
    player.tiles.push(tile)

    player.turn += 1 // 巡目を増やす

    const winnings: Winning[]  = player.judgeHands(tile, "draw") // ツモってるか調べる

    // 待ち牌候補を調べる
    const waitsCandidate = []
    for (let i = 0; i < player.tiles.length; i++) {
      const tilesCopy: Tile[] = []
      for (let j = 0; j < player.tiles.length; j++) { tilesCopy.push(player.tiles[j].copy()) }
      player.tiles.splice(i, 1)
      const waitTiles: Tile[] = player.waitTiles()
      player.tiles = tilesCopy
      waitsCandidate.push({ tile: player.tiles[i], waitTiles: waitTiles })
    }

    io.sockets.emit('Draw', {
      id: playerID,
      tiles: JSON.stringify(player.tiles), 
      stockCount: String(game.stock.length),
      waitsCandidate: JSON.stringify(waitsCandidate),
      isWin: (winnings.length !== 0).toString()
    })
    game.player1.name === playerID ? game.player1 = player : game.player2 = player
  })

  socket.on('Pon', function(playerID: string) {
    const player = game.player1.name === playerID ? game.player1 : game.player2
    const opponent = game.player1.name !== playerID ? game.player1 : game.player2

    const target: Tile = opponent.discards[opponent.discards.length - 1]
    // 手牌から対子削除
    for (let i = 0; i < 2; i++) {
      const index = player.tiles.findIndex(tile => tile.isEqual(target))
      player.tiles.splice(index, 1)
    }
    opponent.discards.pop() // 相手の捨て牌からポンされた牌を削除
    player.minkos.push([target, target, target]) // 明刻追加
    io.sockets.emit('Pon', {
      id: playerID,
      tiles: JSON.stringify(player.tiles),
      minkos: JSON.stringify(player.minkos.map(minko => minko[0])),
      discards: JSON.stringify(opponent.discards)
    })

    game.player1.name === playerID ? game.player1 = player : game.player2 = player
    game.player1.name !== playerID ? game.player1 = opponent : game.player2 = opponent 
  })

  socket.on('Win', function(playerID: string, type: string) {
    const winner = game.player1.name === playerID ? game.player1 : game.player2
    const loser = game.player1.name !== playerID ? game.player1 : game.player2

    let maxWinning: Winning = new Winning([], [], [], [], [], [], new Tile("", 0, ""), "", -1, -1)
    let maxHan = 0
    const winTile = type === "draw" ? winner.tiles[winner.tiles.length - 1] : loser.discards[loser.discards.length - 1]
    const winnings: Winning[]  = winner.judgeHands(winTile, type)
    for (let i = 0; i < winnings.length; i++) {
      // 前処理
      winnings[i].roundWind = game.roundWind
      winnings[i].doras = game.doraTiles
      if ((winner.name === game.player1.name && game.round === 1) || (winner.name === game.player2.name && game.round === 2)) {
        winnings[i].isParent = true
      }

      const tmpHan = winnings[i].judgeHands()
      if (tmpHan > maxHan) {
        maxWinning = winnings[i]
        maxHan = tmpHan
      }
    }

    // 役満は役満以外とは複合しない
    const yakumanHands = maxWinning.hands.filter(hand => hand.han >= 100)
    if (yakumanHands.length !== 0) { maxWinning.hands = yakumanHands }

    const score = maxWinning.calcScore()
    if (score !== undefined) {
      winner.score += score.score
      loser.score -= score.score
    }

    // 局の場、局数を更新
    game.proceedRound(winner.name)

    console.log("score", score)

    io.sockets.emit('Win', {
      id: playerID,
      hands: JSON.stringify(maxWinning.hands.map(hand => hand.name)), 
      score: String(score?.score),
      scoreName: score?.name,
    })
    game.player1.name === playerID ? game.player1 = winner : game.player2 = winner 
    game.player1.name !== playerID ? game.player1 = loser : game.player2 = loser 
  })
})

