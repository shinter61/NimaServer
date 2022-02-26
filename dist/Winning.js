"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Winning = void 0;
const scores_1 = require("./scores");
const Tile_1 = require("./Tile");
class Winning {
    constructor(kotz, minkos, shuntz, ankans, minkans, jantou, chiitoi, kokushi, draw, type, riichiTurn, winTurn) {
        this.kotz = kotz;
        this.minkos = minkos;
        this.shuntz = shuntz;
        this.ankans = ankans;
        this.minkans = minkans;
        this.jantou = jantou;
        this.chiitoi = chiitoi;
        this.kokushi = kokushi;
        this.draw = draw;
        this.type = type;
        this.riichiTurn = riichiTurn;
        this.winTurn = winTurn;
        this.hands = [];
        this.roundWind = "";
        this.isParent = false;
        this.isLastTile = false;
        this.isIppatsuAlived = true;
        this.doras = [];
        this.revDoras = [];
    }
    print() {
        console.log('--- print winning ---');
        for (let i = 0; i < this.kotz.length; i++) {
            console.log('kotz', this.kotz[i][0]);
        }
        for (let i = 0; i < this.minkos.length; i++) {
            console.log('minkos', this.minkos[i][0]);
        }
        for (let i = 0; i < this.shuntz.length; i++) {
            console.log('shuntz', this.shuntz[i]);
        }
        for (let i = 0; i < this.ankans.length; i++) {
            console.log('ankans', this.ankans[i]);
        }
        for (let i = 0; i < this.minkans.length; i++) {
            console.log('minkans', this.minkans[i]);
        }
        for (let i = 0; i < this.jantou.length; i++) {
            console.log('jantou', this.jantou[i]);
        }
    }
    addGameInfo(game, playerID) {
        this.roundWind = game.roundWind;
        this.doras = game.doraTiles;
        this.isLastTile = (game.stock.length === 14);
        const winner = game.player1.name === playerID ? game.player1 : game.player2;
        this.isIppatsuAlived = winner.isIppatsuAlived;
        if (winner.riichiTurn > 0) {
            this.revDoras = game.revDoras();
        }
        if ((winner.name === game.player1.name && game.round === 1) || (winner.name === game.player2.name && game.round === 2)) {
            this.isParent = true;
        }
    }
    flatten() {
        if (this.chiitoi.length !== 0) {
            return this.chiitoi.flat();
        }
        else if (this.kokushi.length !== 0) {
            return this.kokushi;
        }
        else {
            return [this.jantou, this.shuntz, this.kotz, this.minkos, this.ankans, this.minkans].flat(3);
        }
    }
    kotzFlatten() {
        const array = [];
        for (let i = 0; i < this.kotz.length; i++) {
            array.push(this.kotz[i][0]);
        }
        for (let i = 0; i < this.minkos.length; i++) {
            array.push(this.minkos[i][0]);
        }
        for (let i = 0; i < this.ankans.length; i++) {
            array.push(this.ankans[i][0]);
        }
        for (let i = 0; i < this.minkans.length; i++) {
            array.push(this.minkans[i][0]);
        }
        return array;
    }
    isMenzen() {
        return (this.minkos.length + this.minkans.length) === 0;
    }
    calcFu() {
        if (this.chiitoi.length !== 0) {
            return 25;
        }
        if (this.type === "draw" && this.hands.map(hand => hand.name).includes("平和")) {
            return 20;
        }
        const futei = 20; // 副底
        let winWayFu = 0;
        if (this.isMenzen() && this.type === "ron") {
            winWayFu = 10;
        }
        else if (this.type === "draw") {
            winWayFu = 2;
        }
        let mentzFu = 0;
        for (let i = 0; i < this.minkos.length; i++) {
            this.minkos[i][0].isYaochu() ? mentzFu += 4 : mentzFu += 2;
        }
        for (let i = 0; i < this.kotz.length; i++) {
            this.kotz[i][0].isYaochu() ? mentzFu += 8 : mentzFu += 4;
        }
        for (let i = 0; i < this.minkans.length; i++) {
            this.minkans[i][0].isYaochu() ? mentzFu += 16 : mentzFu += 8;
        }
        for (let i = 0; i < this.ankans.length; i++) {
            this.ankans[i][0].isYaochu() ? mentzFu += 32 : mentzFu += 16;
        }
        let jantouFu = 0;
        const yakuhaiArr = ["white", "green", "red", this.roundWind];
        this.isParent ? yakuhaiArr.push("east") : yakuhaiArr.push("south");
        if (yakuhaiArr.includes(this.jantou[0].character)) {
            jantouFu = 2;
        }
        let waitWayFu = 0;
        for (let i = 0; i < this.shuntz.length; i++) {
            // 辺張待ちかどうか
            if (this.shuntz[i][0].number === 1 && this.shuntz[i][2].isEqual(this.draw)) {
                waitWayFu = 2;
            }
            if (this.shuntz[i][2].number === 9 && this.shuntz[i][0].isEqual(this.draw)) {
                waitWayFu = 2;
            }
            // 嵌張待ちかどうか
            if (this.shuntz[i][1].isEqual(this.draw)) {
                waitWayFu = 2;
            }
        }
        // 単騎待ちかどうか
        if (this.jantou[0].isEqual(this.draw)) {
            waitWayFu = 2;
        }
        return Math.ceil((futei + winWayFu + mentzFu + jantouFu + waitWayFu) / 10) * 10;
    }
    calcScore() {
        let han = "", fu = "";
        const totanHan = this.hands.map(hand => hand.han).reduce((sum, el) => sum + el, 0);
        if (totanHan <= 12) {
            han = `${totanHan}飜`;
        }
        else if (totanHan >= 13 && totanHan <= 99) {
            han = "*";
        }
        else if (totanHan >= 100) {
            han = "*".repeat(totanHan / 100);
        }
        if (totanHan <= 4) {
            fu = `${this.calcFu()}符`;
        }
        else {
            fu = "*";
        }
        if (this.type === "draw") {
            if (this.isParent) {
                return scores_1.parentDrawScores.find(el => el.fu === fu && el.han === han);
            }
            else {
                return scores_1.childDrawScores.find(el => el.fu === fu && el.han === han);
            }
        }
        else {
            if (this.isParent) {
                return scores_1.parentRonScores.find(el => el.fu === fu && el.han === han);
            }
            else {
                return scores_1.childRonScores.find(el => el.fu === fu && el.han === han);
            }
        }
    }
    judgeHands() {
        // 1飜役
        this.judgeRiichi();
        this.judgeIppatsu();
        this.judgeTsumo();
        this.judgePinfu();
        this.judgeTanyao();
        this.judgeIpeko();
        this.judgeYakuhai();
        this.judgeBakaze();
        this.judgeJikaze();
        this.judgeRinshan();
        this.judgeChankan();
        this.judgeHaitei();
        this.judgeHoutei();
        // 2飜役
        this.judgeDoubleRiichi();
        this.judgeChanta();
        this.judgeHonroto();
        this.judgeIttsu();
        this.judgeToiToi();
        this.judgeSansyoku();
        this.judgeSananko();
        this.judgeSankantsu();
        this.judgeChiitoi();
        this.judgeShosangen();
        // 3飜役、6飜役
        this.judgeHonitsu();
        this.judgeRyanpeko();
        this.judgeJunchan();
        this.judgeChinitsu();
        // 役満
        this.judgeTenho();
        this.judgeChiho();
        this.judgeDaisangen();
        this.judgeShosushi();
        this.judgeDaisushi();
        this.judgeSuanko();
        this.judgeChinroto();
        this.judgeSukantsu();
        this.judgeTsuiso();
        this.judgeRhuiso();
        this.judgeKokushi();
        this.judgeChuren();
    }
    addDoras() {
        this.judgeDora();
        this.judgeRevDora();
    }
    calcHan() {
        return this.hands.map(hand => hand.han).reduce((sum, el) => sum + el, 0);
    }
    judgeRiichi() {
        if (this.riichiTurn !== -1) {
            this.hands.push({ name: "立直", han: 1 });
        }
    }
    judgeIppatsu() {
        if (!this.isIppatsuAlived) {
            return;
        } // 一発消しされていた場合
        if ((this.type === "draw" && this.winTurn - this.riichiTurn === 1) ||
            (this.type === "ron" && this.winTurn - this.riichiTurn === 0)) {
            this.hands.push({ name: "一発", han: 1 });
        }
    }
    judgeTsumo() {
        if (this.isMenzen() && this.type === "draw") {
            this.hands.push({ name: "門前清自摸和", han: 1 });
        }
    }
    judgePinfu() {
        if (!this.isMenzen()) {
            return;
        }
        let isRyanmen = false;
        for (let i = 0; i < this.shuntz.length; i++) {
            if (this.shuntz[i][0].isEqual(this.draw) || this.shuntz[i][2].isEqual(this.draw)) {
                isRyanmen = true;
            }
        }
        const yakuhaiArr = ["white", "green", "red", this.roundWind];
        this.isParent ? yakuhaiArr.push("east") : yakuhaiArr.push("south");
        if (this.shuntz.length === 4 && !yakuhaiArr.includes(this.jantou[0].character) && isRyanmen) {
            this.hands.push({ name: "平和", han: 1 });
        }
    }
    judgeTanyao() {
        const flattenTiles = this.flatten();
        if (flattenTiles.every(tile => !tile.isYaochu())) {
            this.hands.push({ name: "断么九", han: 1 });
        }
    }
    judgeIpeko() {
        if (!this.isMenzen()) {
            return;
        }
        if (this.shuntz.length <= 1) {
            return;
        }
        const combiArr = [...Array(this.shuntz.length).keys()].map(el => el + 1);
        combiArr.pop();
        let isIpeko = false;
        for (let i = 0; i < this.shuntz.length; i++) {
            for (let j = 0; j < combiArr.length; j++) {
                const shuntz1 = this.shuntz[i];
                const shuntz2 = this.shuntz[combiArr[j]];
                if (shuntz1[0].isEqual(shuntz2[0]) && shuntz1[1].isEqual(shuntz2[1]) && shuntz1[2].isEqual(shuntz2[2])) {
                    isIpeko = true;
                }
            }
            combiArr.shift();
        }
        if (isIpeko) {
            this.hands.push({ name: "一盃口", han: 1 });
        }
    }
    judgeYakuhai() {
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (kotzTiles[i].character === "white") {
                this.hands.push({ name: "役牌: 白", han: 1 });
            }
            if (kotzTiles[i].character === "green") {
                this.hands.push({ name: "役牌: 發", han: 1 });
            }
            if (kotzTiles[i].character === "red") {
                this.hands.push({ name: "役牌: 中", han: 1 });
            }
        }
    }
    judgeBakaze() {
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (kotzTiles[i].character === this.roundWind) {
                if (this.roundWind === "east") {
                    this.hands.push({ name: "場風牌: 東", han: 1 });
                }
                if (this.roundWind === "south") {
                    this.hands.push({ name: "場風牌: 南", han: 1 });
                }
            }
        }
    }
    judgeJikaze() {
        const myWind = this.isParent ? "東" : "南";
        const myWindEn = this.isParent ? "east" : "south";
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (kotzTiles[i].character === myWindEn) {
                this.hands.push({ name: `自風牌: ${myWind}`, han: 1 });
            }
        }
    }
    judgeRinshan() {
        if (this.draw.isRinshan && this.type === "draw") {
            this.hands.push({ name: "嶺上開花", han: 1 });
        }
    }
    // 二麻の場合は振り聴のため成立することがない
    judgeChankan() {
        // if (false) { this.hands.push({ name: "槍槓", han: 1 }) }
    }
    judgeHaitei() {
        if (this.isLastTile && this.type === "draw") {
            this.hands.push({ name: "海底撈月", han: 1 });
        }
    }
    judgeHoutei() {
        if (this.isLastTile && this.type === "ron") {
            this.hands.push({ name: "河底撈魚", han: 1 });
        }
    }
    judgeDora() {
        let doraCount = 0;
        for (let i = 0; i < this.doras.length; i++) {
            const dora = this.doras[i].next();
            if (dora === undefined) {
                continue;
            }
            const flattenTiles = this.flatten();
            for (let j = 0; j < flattenTiles.length; j++) {
                if (flattenTiles[j].isEqual(dora)) {
                    doraCount += 1;
                }
            }
        }
        if (doraCount > 0) {
            this.hands.push({ name: `ドラ${doraCount}`, han: doraCount });
        }
    }
    judgeRevDora() {
        if (this.riichiTurn < 0) {
            return;
        }
        let doraCount = 0;
        for (let i = 0; i < this.revDoras.length; i++) {
            const dora = this.revDoras[i].next();
            if (dora === undefined) {
                continue;
            }
            const flattenTiles = this.flatten();
            for (let j = 0; j < flattenTiles.length; j++) {
                if (flattenTiles[j].isEqual(dora)) {
                    doraCount += 1;
                }
            }
        }
        if (doraCount > 0) {
            this.hands.push({ name: `裏ドラ${doraCount}`, han: doraCount });
        }
    }
    judgeDoubleRiichi() {
        if (this.riichiTurn === 1) {
            const index = this.hands.findIndex(hand => hand.name === "立直");
            this.hands.splice(index, 1);
            this.hands.push({ name: "ダブル立直", han: 2 });
        }
    }
    judgeChanta() {
        if (this.chiitoi.length !== 0 || this.kokushi.length !== 0) {
            return;
        }
        let isChanta = true;
        for (let i = 0; i < this.shuntz.length; i++) {
            if (![1, 7].includes(this.shuntz[i][0].number)) {
                isChanta = false;
            }
        }
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (!kotzTiles[i].isYaochu()) {
                isChanta = false;
            }
        }
        if (!this.jantou[0].isYaochu()) {
            isChanta = false;
        }
        if (isChanta) {
            this.hands.push({ name: "混全帯么九", han: this.isMenzen() ? 2 : 1 });
        }
    }
    judgeHonroto() {
        let isHonroto = true;
        const flattenTiles = this.flatten();
        for (let i = 0; i < flattenTiles.length; i++) {
            if (!flattenTiles[i].isYaochu()) {
                isHonroto = false;
            }
        }
        if (isHonroto) {
            const idx = this.hands.findIndex(hand => hand.name === "混全帯么九");
            if (idx !== -1) {
                this.hands.splice(idx, 1);
            }
            this.hands.push({ name: "混老頭", han: 2 });
        }
    }
    judgeIttsu() {
        const testArr = [false, false, false];
        for (let i = 0; i < this.shuntz.length; i++) {
            if (this.shuntz[i][0].isEqual(new Tile_1.Tile("sou", 1, ""))) {
                testArr[0] = true;
            }
            if (this.shuntz[i][0].isEqual(new Tile_1.Tile("sou", 4, ""))) {
                testArr[1] = true;
            }
            if (this.shuntz[i][0].isEqual(new Tile_1.Tile("sou", 7, ""))) {
                testArr[2] = true;
            }
        }
        if (testArr.every(el => el)) {
            this.hands.push({ name: "一気通貫", han: this.isMenzen() ? 2 : 1 });
        }
    }
    judgeToiToi() {
        if (this.kotz.length + this.minkos.length + this.ankans.length + this.minkans.length === 4) {
            this.hands.push({ name: "対々和", han: 2 });
        }
    }
    judgeSansyoku() {
        const oneArr = [false, false, false];
        const nineArr = [false, false, false];
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (kotzTiles[i].isEqual(new Tile_1.Tile("pin", 1, ""))) {
                oneArr[0] = true;
            }
            if (kotzTiles[i].isEqual(new Tile_1.Tile("sou", 1, ""))) {
                oneArr[1] = true;
            }
            if (kotzTiles[i].isEqual(new Tile_1.Tile("man", 1, ""))) {
                oneArr[2] = true;
            }
            if (kotzTiles[i].isEqual(new Tile_1.Tile("pin", 9, ""))) {
                nineArr[0] = true;
            }
            if (kotzTiles[i].isEqual(new Tile_1.Tile("sou", 9, ""))) {
                nineArr[1] = true;
            }
            if (kotzTiles[i].isEqual(new Tile_1.Tile("man", 9, ""))) {
                nineArr[2] = true;
            }
        }
        if (oneArr.every(el => el) || nineArr.every(el => el)) {
            this.hands.push({ name: "三色同刻", han: 2 });
        }
    }
    judgeSananko() {
        if (this.kotz.length + this.ankans.length + this.minkos.length < 3) {
            return;
        }
        let ankoCount = 0;
        for (let i = 0; i < this.kotz.length; i++) {
            if (!this.kotz[i][0].isEqual(this.draw)) {
                ankoCount++;
            }
        }
        for (let i = 0; i < this.ankans.length; i++) {
            if (!this.ankans[i][0].isEqual(this.draw)) {
                ankoCount++;
            }
        }
        if (this.type === "draw" && (this.kotz.length + this.ankans.length) === 3) {
            this.hands.push({ name: "三暗刻", han: 2 });
        }
        if (this.type === "ron" && ankoCount === 3) {
            this.hands.push({ name: "三暗刻", han: 2 });
        }
    }
    judgeSankantsu() {
        if (this.minkans.length + this.ankans.length === 3) {
            this.hands.push({ name: "三槓子", han: 2 });
        }
    }
    judgeChiitoi() {
        if (this.chiitoi.length !== 0) {
            this.hands.push({ name: "七対子", han: 2 });
        }
    }
    judgeShosangen() {
        let kotzNum = 0;
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (["white", "green", "red"].includes(kotzTiles[i].character)) {
                kotzNum++;
            }
        }
        if (kotzNum === 2 && ["white", "green", "red"].includes(this.jantou[0].character)) {
            this.hands.push({ name: "小三元", han: 2 });
        }
    }
    judgeHonitsu() {
        const flattenTiles = this.flatten();
        const kindArr = flattenTiles.map(tile => tile.kind);
        const uniqKindArr = Array.from(new Set(kindArr));
        if (uniqKindArr.length === 2 && uniqKindArr.includes("")) {
            this.hands.push({ name: "混一色", han: this.isMenzen() ? 3 : 2 });
        }
    }
    judgeRyanpeko() {
        if (!this.isMenzen()) {
            return;
        }
        if (this.shuntz.length !== 4) {
            return;
        }
        const shuntzCopy = this.shuntz.slice();
        let ipekoCount = 0;
        for (let i = 0; i < shuntzCopy.length; i++) {
            for (let j = i; j < shuntzCopy.length; j++) {
                if (i === j) {
                    continue;
                }
                if (shuntzCopy[i][0].isEqual(shuntzCopy[j][0])) {
                    ipekoCount++;
                    shuntzCopy.splice(i, 1);
                    shuntzCopy.splice(j - 1, 1);
                    break;
                }
            }
        }
        if (shuntzCopy[0][0].isEqual(shuntzCopy[1][0])) {
            ipekoCount++;
        }
        if (ipekoCount === 2) {
            const idx = this.hands.findIndex(hand => hand.name === "一盃口");
            if (idx !== -1) {
                this.hands.splice(idx, 1);
            }
            this.hands.push({ name: "二盃口", han: 3 });
        }
    }
    judgeJunchan() {
        if (this.chiitoi.length !== 0 || this.kokushi.length !== 0) {
            return;
        }
        let isJunchan = true;
        for (let i = 0; i < this.shuntz.length; i++) {
            if (![1, 7].includes(this.shuntz[i][0].number)) {
                isJunchan = false;
            }
        }
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (!kotzTiles[i].is19()) {
                isJunchan = false;
            }
        }
        if (!this.jantou[0].is19()) {
            isJunchan = false;
        }
        if (isJunchan) {
            const idx = this.hands.findIndex(hand => hand.name === "混全帯么九");
            if (idx !== -1) {
                this.hands.splice(idx, 1);
            }
            this.hands.push({ name: "純全帯么九", han: this.isMenzen() ? 3 : 2 });
        }
    }
    judgeChinitsu() {
        const flattenTiles = this.flatten();
        const kindArr = flattenTiles.map(tile => tile.kind);
        const uniqKindArr = Array.from(new Set(kindArr));
        if (uniqKindArr.length === 1 && uniqKindArr[0] === "sou") {
            this.hands.push({ name: "清一色", han: this.isMenzen() ? 6 : 5 });
        }
    }
    judgeTenho() {
        if (this.isParent && this.winTurn === 1 && this.type === "draw") {
            this.hands.push({ name: "天和", han: 100 });
        }
    }
    judgeChiho() {
        if (!this.isParent && this.winTurn === 1 && this.type === "draw") {
            this.hands.push({ name: "地和", han: 100 });
        }
    }
    judgeDaisangen() {
        let kotzNum = 0;
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (["white", "green", "red"].includes(kotzTiles[i].character)) {
                kotzNum++;
            }
        }
        if (kotzNum === 3) {
            this.hands.push({ name: "大三元", han: 100 });
        }
    }
    judgeShosushi() {
        if (this.kotz.length + this.minkos.length < 3) {
            return;
        }
        const winds = ["east", "south", "west", "north"];
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (winds.includes(kotzTiles[i].character)) {
                const index = winds.findIndex(wind => wind === kotzTiles[i].character);
                if (index !== -1) {
                    winds.splice(index, 1);
                }
            }
        }
        if (winds.length === 1 && winds[0] === this.jantou[0].character) {
            this.hands.push({ name: "小四喜", han: 100 });
        }
    }
    judgeDaisushi() {
        if (this.kotz.length + this.minkos.length < 4) {
            return;
        }
        const winds = ["east", "south", "west", "north"];
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (winds.includes(kotzTiles[i].character)) {
                const index = winds.findIndex(wind => wind === kotzTiles[i].character);
                if (index !== -1) {
                    winds.splice(index, 1);
                }
            }
        }
        if (winds.length === 0) {
            this.hands.push({ name: "大四喜", han: 200 });
        }
    }
    judgeSuanko() {
        if (this.kotz.length + this.ankans.length !== 4) {
            return;
        }
        let ankoCount = 0;
        for (let i = 0; i < this.kotz.length; i++) {
            if (!this.kotz[i][0].isEqual(this.draw)) {
                ankoCount++;
            }
        }
        for (let i = 0; i < this.ankans.length; i++) {
            if (!this.ankans[i][0].isEqual(this.draw)) {
                ankoCount++;
            }
        }
        if (ankoCount === 4) {
            this.hands.push({ name: "四暗刻単騎", han: 200 });
        }
        else if (this.type === "draw" && (this.kotz.length + this.ankans.length) === 4) {
            this.hands.push({ name: "四暗刻", han: 100 });
        }
    }
    judgeChinroto() {
        if (this.kotz.length + this.minkos.length + this.ankans.length + this.minkans.length !== 4) {
            return;
        }
        let isChinroto = true;
        const kotzTiles = this.kotzFlatten();
        for (let i = 0; i < kotzTiles.length; i++) {
            if (!kotzTiles[i].is19()) {
                isChinroto = false;
            }
        }
        if (isChinroto) {
            this.hands.push({ name: "清老頭", han: 100 });
        }
    }
    judgeSukantsu() {
        if (this.minkans.length + this.ankans.length === 4) {
            this.hands.push({ name: "四槓子", han: 100 });
        }
    }
    judgeTsuiso() {
        const flattenTiles = this.flatten();
        if (flattenTiles.every(tile => tile.kind === "")) {
            this.hands.push({ name: "字一色", han: 100 });
        }
    }
    judgeRhuiso() {
        const flattenTiles = this.flatten();
        if (flattenTiles.every(tile => tile.isEqual(new Tile_1.Tile("sou", 2, "")) || tile.isEqual(new Tile_1.Tile("sou", 3, "")) || tile.isEqual(new Tile_1.Tile("sou", 4, "")) ||
            tile.isEqual(new Tile_1.Tile("sou", 6, "")) || tile.isEqual(new Tile_1.Tile("sou", 8, "")) || tile.isEqual(new Tile_1.Tile("", 0, "green")))) {
            this.hands.push({ name: "緑一色", han: 100 });
        }
    }
    judgeKokushi() {
        if (this.kokushi.length === 0) {
            return;
        }
        const alreadyFounded = [];
        let toitzTile = new Tile_1.Tile("", 0, "");
        for (let i = 0; i < this.kokushi.length; i++) {
            if (alreadyFounded.includes(this.kokushi[i].name())) {
                toitzTile = this.kokushi[i];
                break;
            }
            else {
                alreadyFounded.push(this.kokushi[i].name());
            }
        }
        if (this.draw.isEqual(toitzTile)) {
            this.hands.push({ name: "国士無双十三面", han: 200 });
        }
        else {
            this.hands.push({ name: "国士無双", han: 100 });
        }
    }
    judgeChuren() {
        if (!this.isMenzen()) {
            return;
        }
        const flattenTiles = this.flatten();
        const churenTiles = [
            new Tile_1.Tile("sou", 1, ""),
            new Tile_1.Tile("sou", 1, ""),
            new Tile_1.Tile("sou", 1, ""),
            new Tile_1.Tile("sou", 2, ""),
            new Tile_1.Tile("sou", 3, ""),
            new Tile_1.Tile("sou", 4, ""),
            new Tile_1.Tile("sou", 5, ""),
            new Tile_1.Tile("sou", 6, ""),
            new Tile_1.Tile("sou", 7, ""),
            new Tile_1.Tile("sou", 8, ""),
            new Tile_1.Tile("sou", 9, ""),
            new Tile_1.Tile("sou", 9, ""),
            new Tile_1.Tile("sou", 9, "")
        ];
        for (let i = 0; i < churenTiles.length; i++) {
            const index = flattenTiles.findIndex(tile => tile.isEqual(churenTiles[i]));
            if (index !== -1) {
                flattenTiles.splice(index, 1);
            }
        }
        if (flattenTiles.length === 1 && flattenTiles[0].kind === "sou") {
            if (flattenTiles[0].isEqual(this.draw)) {
                this.hands.push({ name: "純正九蓮宝燈", han: 200 });
            }
            else {
                this.hands.push({ name: "九蓮宝燈", han: 100 });
            }
        }
    }
}
exports.Winning = Winning;
//# sourceMappingURL=Winning.js.map