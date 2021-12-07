"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Tile_1 = require("./Tile");
const Winning_1 = require("./Winning");
class Player {
    constructor() {
        this.id = -1;
        this.name = "";
        this.discards = [];
        this.tiles = [];
        this.minkos = [];
        this.ankans = [];
        this.minkans = [];
        this.turn = 0;
        this.riichiTurn = -1;
        this.score = 35000;
        this.isIppatsuAlived = true;
    }
    reset() {
        this.discards = [];
        this.tiles = [];
        this.minkos = [];
        this.ankans = [];
        this.minkans = [];
        this.turn = 0;
        this.riichiTurn = -1;
        this.isIppatsuAlived = true;
    }
    organizeTile() {
        const pinzuTiles = [];
        const souzuTiles = [];
        const manzuTiles = [];
        const eastTiles = [];
        const southTiles = [];
        const westTiles = [];
        const northTiles = [];
        const whiteTiles = [];
        const greenTiles = [];
        const redTiles = [];
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].kind == "pin") {
                pinzuTiles.push(this.tiles[i]);
            }
            else if (this.tiles[i].kind == "sou") {
                souzuTiles.push(this.tiles[i]);
            }
            else if (this.tiles[i].kind == "man") {
                manzuTiles.push(this.tiles[i]);
            }
            else if (this.tiles[i].character == "east") {
                eastTiles.push(this.tiles[i]);
            }
            else if (this.tiles[i].character == "south") {
                southTiles.push(this.tiles[i]);
            }
            else if (this.tiles[i].character == "west") {
                westTiles.push(this.tiles[i]);
            }
            else if (this.tiles[i].character == "north") {
                northTiles.push(this.tiles[i]);
            }
            else if (this.tiles[i].character == "white") {
                whiteTiles.push(this.tiles[i]);
            }
            else if (this.tiles[i].character == "green") {
                greenTiles.push(this.tiles[i]);
            }
            else if (this.tiles[i].character == "red") {
                redTiles.push(this.tiles[i]);
            }
        }
        pinzuTiles.sort(function (a, b) {
            if (a.number < b.number)
                return -1;
            if (a.number > b.number)
                return 1;
            return 0;
        });
        manzuTiles.sort(function (a, b) {
            if (a.number < b.number)
                return -1;
            if (a.number > b.number)
                return 1;
            return 0;
        });
        souzuTiles.sort(function (a, b) {
            if (a.number < b.number)
                return -1;
            if (a.number > b.number)
                return 1;
            return 0;
        });
        this.tiles = [].concat(souzuTiles, pinzuTiles, manzuTiles, eastTiles, southTiles, westTiles, northTiles, whiteTiles, greenTiles, redTiles);
    }
    extractShuntz(firstIdx, secondIdx) {
        let mentz = [];
        if (firstIdx >= this.tiles.length || firstIdx <= -1) {
            return mentz;
        }
        if (!this.tiles[firstIdx].isSouzu()) {
            return mentz;
        }
        if (secondIdx === undefined) {
            const currentTile = this.tiles[firstIdx].copy();
            currentTile.number += 1;
            for (let i = firstIdx + 1; i < this.tiles.length; i++) {
                if (this.tiles[i].isEqual(currentTile)) {
                    mentz = this.extractShuntz(firstIdx, i);
                    break;
                }
            }
        }
        else {
            const currentTile = this.tiles[secondIdx].copy();
            currentTile.number += 1;
            for (let thirdIdx = secondIdx + 1; thirdIdx < this.tiles.length; thirdIdx++) {
                if (this.tiles[thirdIdx].isEqual(currentTile)) {
                    mentz.push(this.tiles.splice(firstIdx, 1)[0]);
                    mentz.push(this.tiles.splice(secondIdx - 1, 1)[0]);
                    mentz.push(this.tiles.splice(thirdIdx - 2, 1)[0]);
                    break;
                }
            }
        }
        return mentz;
    }
    judgeHands(winTile, type) {
        const myTilesCopy = this.tiles.slice();
        const ankoTiles = [];
        const souzuAnkoTiles = [];
        let kotzTiles = [];
        let shuntzTiles = [];
        let dupCount = 0;
        let prevTile = new Tile_1.Tile("", 0, ""), jantou = [];
        const winnings = [];
        if (type === "ron") {
            this.tiles.push(winTile);
        }
        this.organizeTile();
        // 七対子判定
        const chiitoi = this.judgeChiitoi(winTile, type);
        if (chiitoi !== undefined) {
            this.tiles = myTilesCopy.slice();
            winnings.push(chiitoi);
        }
        // 国士判定
        const kokushi = this.judgeKokushi(winTile, type);
        if (kokushi !== undefined) {
            this.tiles = myTilesCopy;
            return [kokushi];
        }
        for (let i = 0; i < this.tiles.length; i++) {
            if (prevTile.isEqual(this.tiles[i])) {
                dupCount++;
                if (dupCount === 3) {
                    ankoTiles.push(this.tiles[i]);
                }
            }
            else {
                dupCount = 1;
                prevTile = this.tiles[i];
            }
        }
        // 索子の暗刻を取り出す、それ以外の牌の暗刻は面子としてしか使えないため
        for (let i = 0; i < ankoTiles.length; i++) {
            if (ankoTiles[i].kind === "sou") {
                souzuAnkoTiles.push(ankoTiles[i]);
            }
            else {
                const index = this.tiles.findIndex(tile => tile.isEqual(ankoTiles[i]));
                const mentz = this.tiles.splice(index, 3);
                kotzTiles.push(mentz);
            }
        }
        // 各刻子に対し、「刻子として抜き出す（3）」、「雀頭＋１牌とする(2,1)」、「何もしない(1,1,1)」の３パターンがある
        //「刻子として抜き出す（3）」→ 0、「雀頭＋１牌とする(2,1)」→ 1、「何もしない(1,1,1)」→ 2
        // 複数の刻子に対し「雀頭＋１牌とする(2,1)」の扱いをすることはない
        // bit全探索 3進数ver.
        const patterns = [];
        for (let bit = 0; bit < 3 ** souzuAnkoTiles.length; bit++) {
            let tmp = bit;
            const row = [];
            for (let i = 0; i < souzuAnkoTiles.length; i++) {
                row[i] = tmp % 3;
                tmp = Math.floor(tmp / 3);
            }
            if (row.filter(el => el === 1).length >= 2) {
                continue;
            }
            patterns.push(row);
        }
        // 探索前に各値を、リセット用にコピー
        const myTilesCopy2 = this.tiles.slice();
        const kotzTilesCopy = kotzTiles.slice();
        // 全パターン探索
        for (let i = 0; i < patterns.length; i++) {
            for (let j = 0; j < patterns[i].length; j++) {
                if (patterns[i][j] === 0) {
                    // 「刻子として抜き出す（3）」
                    const index = this.tiles.findIndex(tile => tile.isEqual(souzuAnkoTiles[j]));
                    const mentz = this.tiles.splice(index, 3);
                    kotzTiles.push(mentz);
                }
                else if (patterns[i][j] === 1) {
                    // 「雀頭＋１牌とする(2,1)」
                    const index = this.tiles.findIndex(tile => tile.isEqual(souzuAnkoTiles[j]));
                    jantou = this.tiles.splice(index, 2);
                }
                else if (patterns[i][j] === 2) {
                    // 「何もしない(1,1,1)」
                    continue;
                }
            }
            const myTilesCopy3 = this.tiles.slice();
            const kotzTilesCopy2 = kotzTiles.slice();
            if (jantou.length === 0) {
                const jantouCandidate = [];
                for (let j = 0; j < (this.tiles.length - 1); j++) {
                    // 暗刻としては0か2のパターンしかない
                    // 0の場合は事前に3つ抜かれてるので、同じ牌が3連続する場合は必然的に2のパターン、雀頭として扱ってはいけない
                    if (!this.tiles[j].isEqual(this.tiles[j + 1])) {
                        continue;
                    }
                    if (jantouCandidate.length !== 0 && jantouCandidate[jantouCandidate.length - 1].isEqual(this.tiles[j])) {
                        // 3連続するならjantouCandidateの末尾と現在の牌が一致するので候補から削除する
                        jantouCandidate.pop();
                    }
                    else {
                        jantouCandidate.push(this.tiles[j]);
                    }
                }
                for (let j = 0; j < jantouCandidate.length; j++) {
                    // 雀頭抜き出し
                    for (let k = 0; k < this.tiles.length; k++) {
                        if (jantouCandidate[j].isEqual(this.tiles[k])) {
                            jantou = this.tiles.splice(k, 2);
                            break;
                        }
                    }
                    // 順子抜き出し
                    for (let k = 0; k < this.tiles.length; k++) {
                        const shuntz = this.extractShuntz(k);
                        if (shuntz.length !== 0) {
                            shuntzTiles.push(shuntz);
                            k -= 3;
                        }
                    }
                    if ((shuntzTiles.length + kotzTiles.length + this.minkos.length + this.ankans.length + this.minkans.length) === 4 && jantou.length === 2) {
                        winnings.push(new Winning_1.Winning(kotzTiles, this.minkos, shuntzTiles, this.ankans, this.minkans, jantou, [], [], winTile, type, this.riichiTurn, this.turn));
                    }
                    this.tiles = myTilesCopy3.slice();
                    kotzTiles = kotzTilesCopy2.slice();
                    shuntzTiles = [];
                    jantou = [];
                }
                this.tiles = myTilesCopy2.slice();
                kotzTiles = kotzTilesCopy.slice();
            }
            else {
                // 順子抜き出し
                for (let j = 0; j < this.tiles.length; j++) {
                    const shuntz = this.extractShuntz(j);
                    if (shuntz.length !== 0) {
                        shuntzTiles.push(shuntz);
                        j -= 3;
                    }
                }
                if ((shuntzTiles.length + kotzTiles.length + this.minkos.length + this.ankans.length + this.minkans.length) === 4 && jantou.length === 2) {
                    winnings.push(new Winning_1.Winning(kotzTiles, this.minkos, shuntzTiles, this.ankans, this.minkans, jantou, [], [], winTile, type, this.riichiTurn, this.turn));
                }
                this.tiles = myTilesCopy2.slice();
                kotzTiles = kotzTilesCopy.slice();
                shuntzTiles = [];
                jantou = [];
            }
        }
        // 元の牌姿に戻す
        this.tiles = myTilesCopy;
        return winnings;
    }
    judgeChiitoi(drawTile, type) {
        let toitzNum = 0;
        const chiitoi = [];
        for (let i = 0; i < this.tiles.length - 1; i++) {
            if (i % 2 === 0 && this.tiles[i].isEqual(this.tiles[i + 1])) { // 対子
                if (chiitoi.length === 0 || (chiitoi.length !== 0 && !chiitoi[chiitoi.length - 1][0].isEqual(this.tiles[i]))) { // 槓子でない
                    toitzNum++;
                    chiitoi.push([this.tiles[i], this.tiles[i + 1]]);
                }
            }
        }
        if (toitzNum === 7) {
            return new Winning_1.Winning([], [], [], [], [], [], chiitoi, [], drawTile, type, this.riichiTurn, this.turn);
        }
    }
    judgeKokushi(drawTile, type) {
        let toitzNum = 0;
        const alreadyFounded = [];
        for (let i = 0; i < this.tiles.length; i++) {
            if (i !== this.tiles.length - 1 && this.tiles[i].isEqual(this.tiles[i + 1])) {
                toitzNum++;
            }
            if (this.tiles[i].isYaochu() && alreadyFounded.find(tile => tile.isEqual(this.tiles[i])) === undefined) {
                alreadyFounded.push(this.tiles[i]);
            }
        }
        if (alreadyFounded.length === 13 && toitzNum === 1) {
            return new Winning_1.Winning([], [], [], [], [], [], [], this.tiles, drawTile, type, this.riichiTurn, this.turn);
        }
    }
    waitTiles(game) {
        const drawWaits = [];
        const ronWaits = [];
        for (let i = 0; i < Tile_1.allTiles.length; i++) {
            const tilesCopy = [];
            for (let j = 0; j < this.tiles.length; j++) {
                tilesCopy.push(this.tiles[j].copy());
            }
            const winnings = this.judgeHands(Tile_1.allTiles[i], "ron");
            let isYakuExists = false;
            for (let j = 0; j < winnings.length; j++) {
                // 前処理
                winnings[j].addGameInfo(game, this.name);
                winnings[j].judgeHands();
                if (winnings[j].hands.length > 0) {
                    // winnings[j].print()
                    isYakuExists = true;
                }
            }
            if (winnings.length !== 0) {
                drawWaits.push(Tile_1.allTiles[i]);
            }
            if (isYakuExists) {
                ronWaits.push(Tile_1.allTiles[i]);
            }
            this.tiles = tilesCopy;
        }
        return [drawWaits, ronWaits];
    }
    canAnkanTiles(drawTile) {
        return [drawTile];
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map