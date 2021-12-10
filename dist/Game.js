"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Player_1 = require("./Player");
const Tile_1 = require("./Tile");
class Game {
    constructor() {
        this.player1 = new Player_1.Player();
        this.player2 = new Player_1.Player();
        this.stock = [];
        this.round = 1;
        this.roundWind = "east";
        this.honba = 0;
        this.kyotaku = 0;
        this.isEnd = false;
        this.doraTiles = [];
    }
    reload() {
        this.stock = [];
        this.doraTiles = [];
        this.player1.reset();
        this.player2.reset();
        const characters = ["east", "south", "west", "north", "white", "green", "red"];
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const kinds = ["pin", "sou", "man"];
        for (let i = 0; i < characters.length; i++) {
            for (let j = 0; j < 4; j++) {
                const tile = new Tile_1.Tile("", 0, characters[i]);
                this.stock.push(tile);
            }
        }
        for (let i = 0; i < numbers.length; i++) {
            for (let j = 0; j < kinds.length; j++) {
                if (numbers[i] >= 2 && numbers[i] <= 8 && kinds[j] !== "sou") {
                    continue;
                }
                for (let k = 0; k < 4; k++) {
                    const tile = new Tile_1.Tile(kinds[j], numbers[i], "");
                    this.stock.push(tile);
                }
            }
        }
        // shuffle
        for (let i = this.stock.length - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * (i + 1));
            const tmp = this.stock[i];
            this.stock[i] = this.stock[r];
            this.stock[r] = tmp;
        }
        const player1Tiles = this.stock.splice(0, 13);
        const player2Tiles = this.stock.splice(0, 13);
        this.player1.tiles = player1Tiles;
        this.player2.tiles = player2Tiles;
        this.doraTiles.push(this.stock[this.stock.length - 1 - 5]); // 牌山の末尾から5枚目をドラにする
    }
    draw() { return this.stock.shift(); }
    proceedRound(winnerID) {
        if (this.player1.name === winnerID) {
            if (this.round === 2) {
                this.roundWind = "south";
                this.round = 1;
            }
        }
        else if (this.player2.name === winnerID) {
            if (this.round === 1) {
                this.round = 2;
            }
        }
    }
    proceedHonba(winnerID) {
        // 親連荘 || 流局なら本場を積む
        if ((this.player1.id === winnerID && this.round === 1) ||
            (this.player2.id === winnerID && this.round === 2) ||
            (winnerID === -1)) {
            this.honba += 1;
        }
        else {
            this.honba = 0;
        }
    }
    judgeEndGame(winnerID) {
        // 南2局
        if (this.roundWind === "south" && this.round === 2) {
            if (this.player1.name === winnerID) {
                this.isEnd = true;
            }
            if (this.player2.name === winnerID && this.player2.score > this.player1.score) {
                this.isEnd = true;
            }
            if (this.player2.waitTiles(this)[0].length === 0) {
                this.isEnd = true;
            }
        }
        // 飛び終了
        if (this.player1.score < 0 || this.player2.score < 0) {
            this.isEnd = true;
        }
    }
    revDoras() {
        const doras = [];
        for (let i = 0; i < this.doraTiles.length; i++) {
            const tile = this.stock[this.stock.length - 1 - 6 - i * 2];
            doras.push(tile);
        }
        return doras;
    }
    addDora() {
        if (this.doraTiles.length === 1) {
            this.doraTiles.push(this.stock[this.stock.length - 1 - 7]);
        }
        else if (this.doraTiles.length === 2) {
            this.doraTiles.push(this.stock[this.stock.length - 1 - 9]);
        }
        else if (this.doraTiles.length === 3) {
            this.doraTiles.push(this.stock[this.stock.length - 1 - 11]);
        }
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map