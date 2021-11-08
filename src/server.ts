import { createServer } from "http"
import { Server, Socket } from "socket.io"
import express from "express"
import { Game } from "./Game"
import { Player } from "./Player"
import { Tile } from "./Tile"
import { Winning } from "./Winning"
import { honbaScore, kyotakuScore } from "./scores"

const app: express.Express = express();
const server = createServer(app);
const io = new Server(server);

const connections: Socket[] = [];
const matchingUserIDs: string[] = [];

interface StringKeyObject {
  [key: string]: Game
}
const rooms: StringKeyObject = {};

server.listen(process.env.PORT || 3000);
console.log('Server is running...');

io.sockets.on('connection', function(socket: Socket) {
  connections.push(socket)
  console.log('Connect: %s sockets are connected', connections.length);

  // Disconnect
  socket.on('disconnect', function() {
    connections.splice(connections.indexOf(socket), 1);
    const playerID = socket.handshake.auth.name as string
    let targetRoomID = ""
    for (const roomID in rooms) {
      const game = rooms[roomID]
      if (game.player1.name === playerID || game.player2.name === playerID) {
        targetRoomID = roomID
        break
      }
    }

    console.log('Disconnect: %s sockets are connected', connections.length);

    matchingUserIDs.splice(matchingUserIDs.indexOf(playerID), 1);

    if (targetRoomID === "") { return }
    const game = rooms[targetRoomID]

    if (game.isEnd) {
      delete rooms[targetRoomID]
    } else {
      const winner = game.player1.name === playerID ? game.player2 : game.player1
      const loser = game.player1.name === playerID ? game.player1 : game.player2

      delete rooms[targetRoomID]

      io.to(targetRoomID).emit('EndGame', {
        winnerID: winner.name,
        winnerScore: String(winner.score),
        loserID: loser.name,
        loserScore: String(loser.score),
        isDisconnected: "true"
      })
    }
  });

  socket.on('StartMatching', function(userID: string) {
    matchingUserIDs.push(userID);
  })

  socket.on('StartGame', function(roomID: string) {
    let game = rooms[roomID];
    if (game === undefined) { return }

    rooms[roomID].reload()
    rooms[roomID].player1.organizeTile()
    rooms[roomID].player2.organizeTile()
    const tile = rooms[roomID].draw()
    if (tile !== undefined) {
      if (rooms[roomID].round === 1) {
        rooms[roomID].player1.tiles.push(tile)
        rooms[roomID].player1.turn += 1
      } else if (rooms[roomID].round === 2) {
        rooms[roomID].player2.tiles.push(tile)
        rooms[roomID].player2.turn += 1
      }
    }
    
    game = rooms[roomID]
    const { player1, player2 } = game
    io.to(roomID).emit('DistributeInitTiles', {
      id: player1.name,
      tiles: JSON.stringify(player1.tiles),
      score: String(player1.score),
      round: String(game.round),
      roundWind: game.roundWind,
      honba: String(game.honba),
      kyotaku: String(game.kyotaku),
      isParent: (game.round === 1).toString(),
      doraTiles: JSON.stringify(game.doraTiles),
      stockCount: String(game.stock.length - 14)
    })
    io.to(roomID).emit('DistributeInitTiles', {
      id: player2.name,
      tiles: JSON.stringify(player2.tiles),
      score: String(player2.score),
      round: String(game.round),
      roundWind: game.roundWind,
      honba: String(game.honba),
      kyotaku: String(game.kyotaku),
      isParent: (game.round === 2).toString(),
      doraTiles: JSON.stringify(game.doraTiles),
      stockCount: String(game.stock.length - 14)
    })
  })

  socket.on('EndGame', function(roomID: string) {
    const game = rooms[roomID];
    if (game === undefined) { return }

    const winner: Player = game.player1.score >= game.player2.score ? game.player1 : game.player2
    const loser: Player = game.player1.score < game.player2.score ? game.player1 : game.player2

    io.to(roomID).emit('EndGame', {
      winnerID: winner.name,
      winnerScore: String(winner.score),
      loserID: loser.name,
      loserScore: String(loser.score),
      isDisconnected: "false"
    })
  })

  socket.on('Discard', function(roomID: string, playerID: string, tiles: string, isRiichi: boolean) {
    const game = rooms[roomID];
    if (game === undefined) { return }

    const tileObj = (JSON.parse(tiles) as Tile[])[0]
    const discardTile = new Tile(tileObj.kind, tileObj.number, tileObj.character)
    const player = game.player1.name === playerID ? game.player1 : game.player2
    player.discards.push(discardTile)
    player.tiles.splice(player.tiles.findIndex(el => el.isEqual(discardTile)), 1)
    player.organizeTile()

    // 立直関連
    if (player.riichiTurn === -1 && isRiichi) {
      player.riichiTurn = player.turn
      player.score -= 1000
      game.kyotaku += 1
    }

    // 聴牌時の待ち牌を知らせる
    const waitTiles: Tile[] = player.waitTiles()

    io.to(roomID).emit('InformDiscards', {
      id: playerID,
      tiles: JSON.stringify(player.tiles),
      discards: JSON.stringify(player.discards),
      waits: JSON.stringify(waitTiles),
      riichiTurn: String(player.riichiTurn),
      kyotaku: String(game.kyotaku),
      score: String(player.score)
    })
    game.player1.name === playerID ? rooms[roomID].player1 = player : rooms[roomID].player2 = player
  })

  socket.on('Draw', function(roomID: string, playerID: string, isRinshan: boolean) {
    const game = rooms[roomID];
    if (game === undefined) { return }

    const tile = game.draw()
    if (tile === undefined) { return }
    const player = game.player1.name === playerID ? game.player1 : game.player2
    player.tiles.push(tile)

    player.turn += 1 // 巡目を増やす

    if (isRinshan) { game.addDora() }

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

    io.to(roomID).emit('Draw', {
      id: playerID,
      tiles: JSON.stringify(player.tiles), 
      stockCount: String(game.stock.length - 14),
      waitsCandidate: JSON.stringify(waitsCandidate),
      isWin: (winnings.length !== 0).toString(),
      doraTiles: JSON.stringify(game.doraTiles)
    })
    game.player1.name === playerID ? rooms[roomID].player1 = player : rooms[roomID].player2 = player
  })

  socket.on('Pon', function(roomID: string, playerID: string) {
    const game = rooms[roomID];
    if (game === undefined) { return }

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
    io.to(roomID).emit('Pon', {
      id: playerID,
      tiles: JSON.stringify(player.tiles),
      minkos: JSON.stringify(player.minkos.map(minko => minko[0])),
      discards: JSON.stringify(opponent.discards)
    })

    game.player1.name === playerID ? rooms[roomID].player1 = player : rooms[roomID].player2 = player
    game.player1.name !== playerID ? rooms[roomID].player1 = opponent : rooms[roomID].player2 = opponent 
  })

  socket.on('Daiminkan', function(roomID: string, playerID: string) {
    const game = rooms[roomID];
    if (game === undefined) { return }

    const player = game.player1.name === playerID ? game.player1 : game.player2
    const opponent = game.player1.name !== playerID ? game.player1 : game.player2

    const target: Tile = opponent.discards[opponent.discards.length - 1]
    // 手牌から暗刻削除
    for (let i = 0; i < 3; i++) {
      const index = player.tiles.findIndex(tile => tile.isEqual(target))
      player.tiles.splice(index, 1)
    }
    opponent.discards.pop() // 相手の捨て牌からカンされた牌を削除
    player.minkans.push([target, target, target, target]) // 明槓追加
    io.to(roomID).emit('Daiminkan', {
      id: playerID,
      tiles: JSON.stringify(player.tiles),
      minkans: JSON.stringify(player.minkans.map(minkan => minkan[0])),
      discards: JSON.stringify(opponent.discards)
    })

    game.player1.name === playerID ? rooms[roomID].player1 = player : rooms[roomID].player2 = player
    game.player1.name !== playerID ? rooms[roomID].player1 = opponent : rooms[roomID].player2 = opponent 
  })

  socket.on('Kakan', function(roomID: string, playerID: string, tiles: string) {
    const game = rooms[roomID];
    if (game === undefined) { return }

    const player = game.player1.name === playerID ? game.player1 : game.player2
    const tileObj = (JSON.parse(tiles) as Tile[])[0]
    const target = new Tile(tileObj.kind, tileObj.number, tileObj.character)
    // 手牌から加槓牌削除
    const index = player.tiles.findIndex(tile => tile.isEqual(target))
    player.tiles.splice(index, 1)

    // 手牌から明刻削除
    const minkoIdx = player.minkos.findIndex(minko => minko[0].isEqual(target))
    player.minkos.splice(minkoIdx, 1)

    player.minkans.push([target, target, target, target]) // 明槓追加
    io.to(roomID).emit('Kakan', {
      id: playerID,
      tiles: JSON.stringify(player.tiles),
      minkos: JSON.stringify(player.minkos.map(minko => minko[0])),
      minkans: JSON.stringify(player.minkans.map(minkan => minkan[0])),
    })

    game.player1.name === playerID ? rooms[roomID].player1 = player : rooms[roomID].player2 = player
  })

  socket.on('Ankan', function(roomID: string, playerID: string, tiles: string) {
    const game = rooms[roomID];
    if (game === undefined) { return }

    const player = game.player1.name === playerID ? game.player1 : game.player2
    const tileObj = (JSON.parse(tiles) as Tile[])[0]
    const target = new Tile(tileObj.kind, tileObj.number, tileObj.character)
    // 手牌から暗槓削除
    for (let i = 0; i < 4; i++) {
      const index = player.tiles.findIndex(tile => tile.isEqual(target))
      player.tiles.splice(index, 1)
    }

    player.ankans.push([target, target, target, target]) // 暗槓追加

    io.to(roomID).emit('Ankan', {
      id: playerID,
      tiles: JSON.stringify(player.tiles),
      ankans: JSON.stringify(player.ankans.map(ankan => ankan[0])),
    })

    game.player1.name === playerID ? rooms[roomID].player1 = player : rooms[roomID].player2 = player
  })

  socket.on('ExhaustiveDraw', function(roomID: string) {
    const game = rooms[roomID]
    if (game === undefined) { return }

    const player1WaitTiles = game.player1.waitTiles()
    const player2WaitTiles = game.player2.waitTiles()
    const isPlayer1Tenpai = player1WaitTiles.length !== 0
    const isPlayer2Tenpai = player2WaitTiles.length !== 0

    if ((isPlayer1Tenpai && isPlayer2Tenpai) || (!isPlayer1Tenpai && !isPlayer2Tenpai)) {
      // 本場増やす
    } else if (isPlayer1Tenpai) {
      rooms[roomID].player1.score += 1500
      rooms[roomID].player2.score -= 1500
    } else if (isPlayer2Tenpai) {
      rooms[roomID].player2.score += 1500
      rooms[roomID].player1.score -= 1500
    }

    // 終局判定
    game.judgeEndGame("")
    
    // 局数進める
    if (!isPlayer2Tenpai && game.round === 2) {
      rooms[roomID].round = 1
      rooms[roomID].roundWind = "south"
    } else if (!isPlayer1Tenpai && game.round === 1) {
      rooms[roomID].round = 2
    }

    // 本場を積む
    game.proceedHonba("")

    io.to(roomID).emit('ExhaustiveDraw', {
      id1: rooms[roomID].player1.name,
      score1: String(rooms[roomID].player1.score),
      tiles1: JSON.stringify(game.player1.tiles),
      waitTiles1: JSON.stringify(player1WaitTiles),
      id2: rooms[roomID].player2.name,
      score2: String(rooms[roomID].player2.score),
      tiles2: JSON.stringify(game.player2.tiles),
      waitTiles2: JSON.stringify(player2WaitTiles),
      isGameEnd: game.isEnd.toString()
    })
  })

  socket.on('Win', function(roomID: string, playerID: string, type: string) {
    const game = rooms[roomID];
    if (game === undefined) { return }

    const winner = game.player1.name === playerID ? game.player1 : game.player2
    const loser = game.player1.name !== playerID ? game.player1 : game.player2

    let maxWinning: Winning = new Winning([], [], [], [], [], [], [], [], new Tile("", 0, ""), "", -1, -1)
    let maxHan = 0
    const winTile = type === "draw" ? winner.tiles[winner.tiles.length - 1] : loser.discards[loser.discards.length - 1]
    const winnings: Winning[]  = winner.judgeHands(winTile, type)
    for (let i = 0; i < winnings.length; i++) {
      // 前処理
      winnings[i].roundWind = game.roundWind
      winnings[i].doras = game.doraTiles
      if (winner.riichiTurn > 0) { winnings[i].revDoras = game.revDoras() }
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
      winner.score += score.score + game.honba * honbaScore + game.kyotaku * kyotakuScore
      loser.score -= score.score + game.honba * honbaScore
    }

    // 終局判定
    game.judgeEndGame(winner.name)

    // 本場を積む
    game.proceedHonba("")

    // 供託リセット
    game.kyotaku = 0

    // 局の場、局数を更新
    game.proceedRound(winner.name)

    io.to(roomID).emit('Win', {
      id: playerID,
      tiles: JSON.stringify(winner.tiles),
      hands: JSON.stringify(maxWinning.hands.map(hand => hand.name)), 
      revDoras: JSON.stringify(game.revDoras()),
      score: String(score?.score),
      scoreName: score?.name,
      winType: type,
      isGameEnd: game.isEnd.toString()
    })
    game.player1.name === playerID ? rooms[roomID].player1 = winner : rooms[roomID].player2 = winner 
    game.player1.name !== playerID ? rooms[roomID].player1 = loser : rooms[roomID].player2 = loser 
  })
})

setInterval(() => {
  console.log('matchingUserIDs', matchingUserIDs)
  for (let i = 0; i < matchingUserIDs.length; i++) {
    if (i === matchingUserIDs.length-1 && i%2 === 1) { return }

    const roomID = new Date().getTime().toString();
    const userID1 = matchingUserIDs[i];
    const userID2 = matchingUserIDs[i+1];

    const socket1 = connections.find(socket => socket.handshake.auth.name === userID1)
    const socket2 = connections.find(socket => socket.handshake.auth.name === userID2)
    if (socket1 === undefined || socket2 === undefined) { return }
    void socket1.join(roomID); void socket2.join(roomID);

    const game = new Game;
    game.player1.name = userID1;
    game.player2.name = userID2;
    rooms[roomID] = game;
    io.to(roomID).emit('InformPlayersNames', { player1: game.player1.name, player2: game.player2.name, roomID })

    matchingUserIDs.splice(0, 2);
    i -= 2;
  }
}, 1000)
