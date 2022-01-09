"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const Game_1 = require("./Game");
const Tile_1 = require("./Tile");
const Winning_1 = require("./Winning");
const scores_1 = require("./scores");
const users_1 = require("./routes/users");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/users', users_1.userRouter);
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const connections = [];
const matchingUserIDs = [];
const rooms = {};
server.listen(process.env.PORT || 3000);
console.log('Server is running...');
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connect: %s sockets are connected', connections.length);
    // Disconnect
    socket.on('disconnect', function () {
        connections.splice(connections.indexOf(socket), 1);
        const playerID = Number(socket.handshake.auth.id);
        let targetRoomID = "";
        for (const roomID in rooms) {
            const game = rooms[roomID];
            if (game.player1.id === playerID || game.player2.id === playerID) {
                targetRoomID = roomID;
                break;
            }
        }
        console.log('Disconnect: %s sockets are connected', connections.length);
        const matchingIdx = matchingUserIDs.findIndex(el => el.id === Number(playerID));
        if (matchingIdx >= 0) {
            matchingUserIDs.splice(matchingIdx, 1);
        }
        if (targetRoomID === "") {
            return;
        }
        const game = rooms[targetRoomID];
        if (game.isEnd) {
            delete rooms[targetRoomID];
        }
        else {
            const winner = game.player1.id === playerID ? game.player2 : game.player1;
            const loser = game.player1.id === playerID ? game.player1 : game.player2;
            delete rooms[targetRoomID];
            io.to(targetRoomID).emit('EndGame', {
                winnerID: String(winner.id),
                winnerScore: String(winner.score),
                loserID: String(loser.id),
                loserScore: String(loser.score),
                isDisconnected: "true"
            });
        }
    });
    socket.on('StartMatching', function (userID, userName) {
        matchingUserIDs.push({ id: Number(userID), name: String(userName) });
    });
    socket.on('StartGame', function (roomID) {
        let game = rooms[roomID];
        if (game === undefined) {
            return;
        }
        rooms[roomID].reload();
        rooms[roomID].player1.organizeTile();
        rooms[roomID].player2.organizeTile();
        game = rooms[roomID];
        const { player1, player2 } = game;
        io.to(roomID).emit('DistributeInitTiles', {
            id: String(player1.id),
            tiles: JSON.stringify(player1.tiles),
            score: String(player1.score),
            round: String(game.round),
            roundWind: game.roundWind,
            honba: String(game.honba),
            kyotaku: String(game.kyotaku),
            isParent: (game.round === 1).toString(),
            doraTiles: JSON.stringify(game.doraTiles),
            stockCount: String(game.stock.length - 14)
        });
        io.to(roomID).emit('DistributeInitTiles', {
            id: String(player2.id),
            tiles: JSON.stringify(player2.tiles),
            score: String(player2.score),
            round: String(game.round),
            roundWind: game.roundWind,
            honba: String(game.honba),
            kyotaku: String(game.kyotaku),
            isParent: (game.round === 2).toString(),
            doraTiles: JSON.stringify(game.doraTiles),
            stockCount: String(game.stock.length - 14)
        });
    });
    socket.on('EndGame', function (roomID) {
        const game = rooms[roomID];
        if (game === undefined) {
            return;
        }
        const winner = game.player1.score >= game.player2.score ? game.player1 : game.player2;
        const loser = game.player1.score < game.player2.score ? game.player1 : game.player2;
        io.to(roomID).emit('EndGame', {
            winnerID: String(winner.id),
            winnerScore: String(winner.score),
            loserID: String(loser.id),
            loserScore: String(loser.score),
            isDisconnected: "false"
        });
    });
    socket.on('Discard', function (roomID, playerID, tiles, isRiichi) {
        const game = rooms[roomID];
        if (game === undefined) {
            return;
        }
        const tileObj = JSON.parse(tiles)[0];
        const discardTile = new Tile_1.Tile(tileObj.kind, tileObj.number, tileObj.character);
        const player = game.player1.id === Number(playerID) ? game.player1 : game.player2;
        player.discards.push(discardTile);
        const targetIdx = player.tiles.findIndex(el => el.isEqual(discardTile));
        const isTedashi = targetIdx !== (player.tiles.length - 1);
        player.tiles.splice(targetIdx, 1);
        player.organizeTile();
        // 立直関連
        if (player.riichiTurn === -1 && isRiichi) {
            player.riichiTurn = player.turn;
            player.score -= 1000;
            game.kyotaku += 1;
        }
        // 聴牌時の待ち牌を知らせる
        const drawWaits = player.waitTiles(game)[0];
        const tile = game.draw(); // 河底撈魚を役有りで判定させるために一度ツモらせる
        if (tile === undefined) {
            return;
        }
        const ronWaits = player.waitTiles(game)[1];
        game.stock.unshift(tile); // 元に戻す
        io.to(roomID).emit('InformDiscards', {
            id: String(player.id),
            tiles: JSON.stringify(player.tiles),
            discards: JSON.stringify(player.discards),
            drawWaits: JSON.stringify(drawWaits),
            ronWaits: JSON.stringify(ronWaits),
            riichiTurn: String(player.riichiTurn === -1 ? -1 : player.bendTurn),
            kyotaku: String(game.kyotaku),
            score: String(player.score),
            isTedashi: isTedashi.toString()
        });
        game.player1.id === Number(playerID) ? rooms[roomID].player1 = player : rooms[roomID].player2 = player;
    });
    socket.on('InformRiichi', function (roomID, playerID, tiles) {
        const tileObj = JSON.parse(tiles)[0];
        const discardTile = new Tile_1.Tile(tileObj.kind, tileObj.number, tileObj.character);
        io.to(roomID).emit('InformRiichi', { id: String(playerID), discardTile: JSON.stringify([discardTile]) });
    });
    socket.on('InformPon', function (roomID, playerID) {
        io.to(roomID).emit('InformPon', { id: String(playerID) });
    });
    socket.on('InformAnkan', function (roomID, playerID) {
        io.to(roomID).emit('InformAnkan', { id: String(playerID) });
    });
    socket.on('InformKakan', function (roomID, playerID) {
        io.to(roomID).emit('InformKakan', { id: String(playerID) });
    });
    socket.on('Draw', function (roomID, playerID, isRinshan) {
        const game = rooms[roomID];
        if (game === undefined) {
            return;
        }
        const tile = game.draw();
        if (tile === undefined) {
            return;
        }
        const player = game.player1.id === Number(playerID) ? game.player1 : game.player2;
        const drawWaitTiles = player.waitTiles(game)[0];
        const drawWaitTilesStr = drawWaitTiles.map(tile => tile.name()).join();
        if (isRinshan) {
            tile.isRinshan = true;
            game.addDora();
        }
        player.tiles.push(tile);
        player.turn += 1; // 巡目を増やす
        if (player.riichiTurn === -1) {
            player.bendTurn += 1;
        }
        const winnings = player.judgeHands(tile, "draw"); // ツモってるか調べる
        let isWin = false;
        for (let i = 0; i < winnings.length; i++) {
            // 前処理
            winnings[i].addGameInfo(game, player.name);
            winnings[i].judgeHands();
            if (winnings[i].hands.length > 0) {
                isWin = true;
            }
        }
        // 待ち牌候補を調べる
        const waitsCandidate = [];
        for (let i = 0; i < player.tiles.length; i++) {
            const tilesCopy = [];
            for (let j = 0; j < player.tiles.length; j++) {
                tilesCopy.push(player.tiles[j].copy());
            }
            player.tiles.splice(i, 1);
            const waitTiles = player.waitTiles(game);
            player.tiles = tilesCopy;
            waitsCandidate.push({ tile: player.tiles[i], waitTiles: waitTiles[0] });
        }
        // 暗槓できる牌を調べる
        const tilesCopy = [];
        for (let j = 0; j < player.tiles.length; j++) {
            tilesCopy.push(player.tiles[j].copy());
        }
        player.organizeTile();
        const canAnkanTiles = [];
        let count = 1;
        for (let i = 1; i < player.tiles.length; i++) {
            if (player.tiles[i].isEqual(player.tiles[i - 1])) {
                count += 1;
                if (count === 4) {
                    canAnkanTiles.push(player.tiles[i]);
                }
            }
            else {
                count = 1;
            }
        }
        // 立直中の暗槓で、待ちが変わらないか確認する
        if (player.riichiTurn !== -1) {
            for (let i = 0; i < canAnkanTiles.length; i++) {
                const tilesCopy2 = [];
                for (let j = 0; j < player.tiles.length; j++) {
                    tilesCopy2.push(player.tiles[j].copy());
                }
                const ankansCopy = [];
                for (let j = 0; j < player.ankans.length; j++) {
                    ankansCopy.push(player.ankans[j]);
                }
                const target = canAnkanTiles[i];
                // 手牌から暗槓削除
                for (let j = 0; j < 4; j++) {
                    const index = player.tiles.findIndex(tile => tile.isEqual(target));
                    player.tiles.splice(index, 1);
                }
                player.ankans.push([target, target, target, target]); // 暗槓追加
                const waitTilesStr = player.waitTiles(game)[0].map(tile => tile.name()).join();
                if (drawWaitTilesStr !== waitTilesStr) {
                    canAnkanTiles.splice(i, 1);
                    i--;
                }
                player.tiles = tilesCopy2;
                player.ankans = ankansCopy;
            }
        }
        player.tiles = tilesCopy;
        io.to(roomID).emit('Draw', {
            id: String(player.id),
            tiles: JSON.stringify(player.tiles),
            stockCount: String(game.stock.length - 14),
            waitsCandidate: JSON.stringify(waitsCandidate),
            isWin: isWin.toString(),
            canAnkanTiles: JSON.stringify(canAnkanTiles),
            doraTiles: JSON.stringify(game.doraTiles)
        });
        game.player1.id === Number(playerID) ? rooms[roomID].player1 = player : rooms[roomID].player2 = player;
    });
    socket.on('Pon', function (roomID, playerID) {
        const game = rooms[roomID];
        if (game === undefined) {
            return;
        }
        const player = game.player1.id === Number(playerID) ? game.player1 : game.player2;
        const opponent = game.player1.id !== Number(playerID) ? game.player1 : game.player2;
        const target = opponent.discards[opponent.discards.length - 1];
        // 手牌から対子削除
        for (let i = 0; i < 2; i++) {
            const index = player.tiles.findIndex(tile => tile.isEqual(target));
            player.tiles.splice(index, 1);
        }
        opponent.discards.pop(); // 相手の捨て牌からポンされた牌を削除
        player.minkos.push([target, target, target]); // 明刻追加
        // 一発消しの処理
        if (opponent.riichiTurn === opponent.turn) {
            opponent.isIppatsuAlived = false;
        }
        if (opponent.riichiTurn === -1) {
            opponent.bendTurn -= 1;
        }
        console.log("bend turn", opponent.bendTurn);
        io.to(roomID).emit('Pon', {
            id: String(player.id),
            tiles: JSON.stringify(player.tiles),
            minkos: JSON.stringify(player.minkos.map(minko => minko[0])),
            discards: JSON.stringify(opponent.discards)
        });
        game.player1.id === Number(playerID) ? rooms[roomID].player1 = player : rooms[roomID].player2 = player;
        game.player1.id !== Number(playerID) ? rooms[roomID].player1 = opponent : rooms[roomID].player2 = opponent;
    });
    socket.on('Daiminkan', function (roomID, playerID) {
        const game = rooms[roomID];
        if (game === undefined) {
            return;
        }
        const player = game.player1.id === Number(playerID) ? game.player1 : game.player2;
        const opponent = game.player1.id !== Number(playerID) ? game.player1 : game.player2;
        const target = opponent.discards[opponent.discards.length - 1];
        // 手牌から暗刻削除
        for (let i = 0; i < 3; i++) {
            const index = player.tiles.findIndex(tile => tile.isEqual(target));
            player.tiles.splice(index, 1);
        }
        opponent.discards.pop(); // 相手の捨て牌からカンされた牌を削除
        player.minkans.push([target, target, target, target]); // 明槓追加
        // 一発消しの処理
        if (opponent.riichiTurn === opponent.turn) {
            opponent.isIppatsuAlived = false;
        }
        if (opponent.riichiTurn === -1) {
            opponent.bendTurn -= 1;
        }
        io.to(roomID).emit('Daiminkan', {
            id: String(player.id),
            tiles: JSON.stringify(player.tiles),
            minkans: JSON.stringify(player.minkans.map(minkan => minkan[0])),
            discards: JSON.stringify(opponent.discards)
        });
        game.player1.id === Number(playerID) ? rooms[roomID].player1 = player : rooms[roomID].player2 = player;
        game.player1.id !== Number(playerID) ? rooms[roomID].player1 = opponent : rooms[roomID].player2 = opponent;
    });
    socket.on('Kakan', function (roomID, playerID, tiles) {
        const game = rooms[roomID];
        if (game === undefined) {
            return;
        }
        const player = game.player1.id === Number(playerID) ? game.player1 : game.player2;
        const opponent = game.player1.id !== Number(playerID) ? game.player1 : game.player2;
        const tileObj = JSON.parse(tiles)[0];
        const target = new Tile_1.Tile(tileObj.kind, tileObj.number, tileObj.character);
        // 手牌から加槓牌削除
        const index = player.tiles.findIndex(tile => tile.isEqual(target));
        player.tiles.splice(index, 1);
        // 手牌から明刻削除
        const minkoIdx = player.minkos.findIndex(minko => minko[0].isEqual(target));
        player.minkos.splice(minkoIdx, 1);
        player.minkans.push([target, target, target, target]); // 明槓追加
        // 一発消しの処理
        if (opponent.riichiTurn === opponent.turn) {
            opponent.isIppatsuAlived = false;
        }
        if (player.riichiTurn === -1) {
            player.bendTurn -= 1;
        }
        io.to(roomID).emit('Kakan', {
            id: String(player.id),
            tiles: JSON.stringify(player.tiles),
            minkos: JSON.stringify(player.minkos.map(minko => minko[0])),
            minkans: JSON.stringify(player.minkans.map(minkan => minkan[0])),
        });
        game.player1.id === Number(playerID) ? rooms[roomID].player1 = player : rooms[roomID].player2 = player;
        game.player1.id !== Number(playerID) ? rooms[roomID].player1 = opponent : rooms[roomID].player2 = opponent;
    });
    socket.on('Ankan', function (roomID, playerID, tiles) {
        const game = rooms[roomID];
        if (game === undefined) {
            return;
        }
        const player = game.player1.id === Number(playerID) ? game.player1 : game.player2;
        const opponent = game.player1.id !== Number(playerID) ? game.player1 : game.player2;
        const tileObj = JSON.parse(tiles)[0];
        const target = new Tile_1.Tile(tileObj.kind, tileObj.number, tileObj.character);
        // 手牌から暗槓削除
        for (let i = 0; i < 4; i++) {
            const index = player.tiles.findIndex(tile => tile.isEqual(target));
            player.tiles.splice(index, 1);
        }
        player.ankans.push([target, target, target, target]); // 暗槓追加
        // 一発消しの処理
        if (opponent.riichiTurn === opponent.turn) {
            opponent.isIppatsuAlived = false;
        }
        if (player.riichiTurn === -1) {
            player.bendTurn -= 1;
        }
        io.to(roomID).emit('Ankan', {
            id: String(player.id),
            tiles: JSON.stringify(player.tiles),
            ankans: JSON.stringify(player.ankans.map(ankan => ankan[0])),
        });
        game.player1.id === Number(playerID) ? rooms[roomID].player1 = player : rooms[roomID].player2 = player;
        game.player1.id !== Number(playerID) ? rooms[roomID].player1 = opponent : rooms[roomID].player2 = opponent;
    });
    socket.on('ExhaustiveDraw', function (roomID) {
        const game = rooms[roomID];
        if (game === undefined) {
            return;
        }
        const player1WaitTiles = rooms[roomID].player1.waitTiles(game)[0];
        const player2WaitTiles = rooms[roomID].player2.waitTiles(game)[0];
        const isPlayer1Tenpai = player1WaitTiles.length !== 0;
        const isPlayer2Tenpai = player2WaitTiles.length !== 0;
        if ((isPlayer1Tenpai && isPlayer2Tenpai) || (!isPlayer1Tenpai && !isPlayer2Tenpai)) {
            // 本場増やす
        }
        else if (isPlayer1Tenpai) {
            rooms[roomID].player1.score += 1500;
            rooms[roomID].player2.score -= 1500;
        }
        else if (isPlayer2Tenpai) {
            rooms[roomID].player2.score += 1500;
            rooms[roomID].player1.score -= 1500;
        }
        // 終局判定
        rooms[roomID].judgeEndGame(-1);
        // 局数進める
        if (!isPlayer2Tenpai && game.round === 2) {
            rooms[roomID].round = 1;
            rooms[roomID].roundWind = "south";
        }
        else if (!isPlayer1Tenpai && game.round === 1) {
            rooms[roomID].round = 2;
        }
        // 本場を積む
        rooms[roomID].proceedHonba(-1);
        io.to(roomID).emit('ExhaustiveDraw', {
            id1: String(rooms[roomID].player1.id),
            score1: String(rooms[roomID].player1.score),
            tiles1: JSON.stringify(rooms[roomID].player1.tiles),
            waitTiles1: JSON.stringify(player1WaitTiles),
            id2: String(rooms[roomID].player2.id),
            score2: String(rooms[roomID].player2.score),
            tiles2: JSON.stringify(rooms[roomID].player2.tiles),
            waitTiles2: JSON.stringify(player2WaitTiles),
            isGameEnd: rooms[roomID].isEnd.toString()
        });
    });
    socket.on('Win', function (roomID, playerID, type) {
        const game = rooms[roomID];
        if (game === undefined) {
            return;
        }
        const winner = game.player1.id === Number(playerID) ? game.player1 : game.player2;
        const loser = game.player1.id !== Number(playerID) ? game.player1 : game.player2;
        let maxWinning = new Winning_1.Winning([], [], [], [], [], [], [], [], new Tile_1.Tile("", 0, ""), "", -1, -1);
        let maxHan = 0;
        const winTile = type === "draw" ? winner.tiles[winner.tiles.length - 1] : loser.discards[loser.discards.length - 1];
        const winnings = winner.judgeHands(winTile, type);
        for (let i = 0; i < winnings.length; i++) {
            // 前処理
            winnings[i].addGameInfo(game, winner.name);
            winnings[i].judgeHands();
            winnings[i].addDoras();
            const tmpHan = winnings[i].calcHan();
            if (tmpHan > maxHan) {
                maxWinning = winnings[i];
                maxHan = tmpHan;
            }
        }
        // 役満は役満以外とは複合しない
        const yakumanHands = maxWinning.hands.filter(hand => hand.han >= 100);
        if (yakumanHands.length !== 0) {
            maxWinning.hands = yakumanHands;
        }
        const score = maxWinning.calcScore();
        if (score !== undefined) {
            winner.score += score.score + game.honba * scores_1.honbaScore + game.kyotaku * scores_1.kyotakuScore;
            loser.score -= score.score + game.honba * scores_1.honbaScore;
        }
        // 終局判定
        game.judgeEndGame(winner.id);
        // 本場を積む
        game.proceedHonba(winner.id);
        // 供託リセット
        game.kyotaku = 0;
        // 局の場、局数を更新
        game.proceedRound(winner.id);
        // ロンで和了した時は和了牌を追加する
        if (type !== "draw") {
            winner.tiles.push(winTile);
        }
        io.to(roomID).emit('Win', {
            id: String(winner.id),
            tiles: JSON.stringify(winner.tiles),
            hands: JSON.stringify(maxWinning.hands),
            revDoras: JSON.stringify(game.revDoras()),
            score: String(score === null || score === void 0 ? void 0 : score.score),
            scoreName: score === null || score === void 0 ? void 0 : score.name,
            winType: type,
            isGameEnd: game.isEnd.toString()
        });
        game.player1.id === Number(playerID) ? rooms[roomID].player1 = winner : rooms[roomID].player2 = winner;
        game.player1.id !== Number(playerID) ? rooms[roomID].player1 = loser : rooms[roomID].player2 = loser;
    });
});
setInterval(() => {
    console.log('matchingUserIDs', matchingUserIDs);
    for (let i = 0; i < matchingUserIDs.length; i++) {
        if (i === matchingUserIDs.length - 1 || i % 2 === 1) {
            return;
        }
        const roomID = new Date().getTime().toString();
        const user1 = matchingUserIDs[i];
        const user2 = matchingUserIDs[i + 1];
        const socket1 = connections.find(socket => Number(socket.handshake.auth.id) === user1.id);
        const socket2 = connections.find(socket => Number(socket.handshake.auth.id) === user2.id);
        if (socket1 === undefined || socket2 === undefined) {
            return;
        }
        void socket1.join(roomID);
        void socket2.join(roomID);
        const game = new Game_1.Game;
        game.player1.id = user1.id;
        game.player1.name = user1.name;
        game.player2.id = user2.id;
        game.player2.name = user2.name;
        rooms[roomID] = game;
        io.to(roomID).emit('InformPlayersNames', {
            player1ID: String(game.player1.id),
            player1Name: game.player1.name,
            player2ID: String(game.player2.id),
            player2Name: game.player2.name,
            roomID
        });
        matchingUserIDs.splice(0, 2);
        i -= 2;
    }
}, 1000);
//# sourceMappingURL=server.js.map