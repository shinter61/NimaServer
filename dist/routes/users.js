"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const devDBUri = `postgres://${(_a = process.env.POSTGRES_USER) !== null && _a !== void 0 ? _a : ""}:${(_b = process.env.POSTGRES_PASSWORD) !== null && _b !== void 0 ? _b : ""}@docker.for.mac.localhost:5432/${(_c = process.env.POSTGRES_DB) !== null && _c !== void 0 ? _c : ""}`;
const router = express_1.default.Router();
exports.userRouter = router;
router.post('/sign_up', function (req, res) {
    const dbClient = new pg_1.Client({
        connectionString: process.env.DATABASE_URL || devDBUri,
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
    });
    void dbClient.connect();
    const query = 'INSERT INTO users(name, password, rating) VALUES($1, $2, $3) RETURNING *';
    const httpBody = req.body;
    const params = [httpBody.name, httpBody.password, 1000];
    dbClient
        .query(query, params)
        .then(data => {
        const user = data.rows[0];
        res.send({
            id: user.id,
            name: user.name,
            rating: user.rating
        });
    })
        .catch(err => {
        console.error(err);
        res.status(400).send();
    })
        .finally(() => void dbClient.end());
});
router.post('/sign_in', function (req, res) {
    const dbClient = new pg_1.Client({
        connectionString: process.env.DATABASE_URL || devDBUri,
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
    });
    void dbClient.connect();
    const query = 'SELECT * FROM users WHERE id = $1 AND password = $2';
    const params = [req.body.id, req.body.password];
    dbClient
        .query(query, params)
        .then(data => {
        const user = data.rows[0];
        console.log(user);
        res.send({
            id: user.id,
            name: user.name,
            rating: user.rating
        });
    })
        .catch(err => {
        console.error(err);
        res.status(400).send();
    })
        .finally(() => void dbClient.end());
});
//# sourceMappingURL=users.js.map