import express from "express"
import { Client } from "pg"

const devDBUri = `postgres://${process.env.POSTGRES_USER ?? ""}:${process.env.POSTGRES_PASSWORD ?? ""}@docker.for.mac.localhost:5432/${process.env.POSTGRES_DB ?? ""}`

const router = express.Router()

type User = {
  id: number
  name: string
  rating: number
}

router.post('/sign_up', function(req, res) {
  const dbClient = new Client({
    connectionString: process.env.DATABASE_URL || devDBUri,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  })
  void dbClient.connect()
  const query = 'INSERT INTO users(name, password, rating) VALUES($1, $2, $3) RETURNING *'

  const httpBody = req.body as { name: string, password: string }
  const params = [httpBody.name, httpBody.password, 1000]

  dbClient
    .query(query, params)
    .then(data => {
      const user = data.rows[0] as User
      res.send({
        id: user.id,
        name: user.name,
        rating: user.rating
      })
    })
    .catch(err => {
      console.error(err)
      res.status(400).send()
    })
    .finally(() => void dbClient.end())
})

router.post('/sign_in', function(req: { body: { id: number, password: string } }, res) {
  const dbClient = new Client({
    connectionString: process.env.DATABASE_URL || devDBUri,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  })
  void dbClient.connect()
  const query = 'SELECT * FROM users WHERE id = $1 AND password = $2'
  const params = [req.body.id, req.body.password]

  dbClient
    .query(query, params)
    .then(data => {
      const user = data.rows[0] as User
      console.log(user)
      res.send({
        id: user.id,
        name: user.name,
        rating: user.rating
      })
    })
    .catch(err => {
      console.error(err)
      res.status(400).send()
    })
    .finally(() => void dbClient.end())
})

function calcRate(myRate: number, yourRate: number): number {
  const win_ratio = 1 / (10 ** ((myRate - yourRate)/400) + 1)
  return Math.round(16 * win_ratio)
}

router.put('/rating', async function(req: { body: {
  winnerID: number,
  loserID: number,
} }, res) {
  if (req.body.winnerID <= 0 || req.body.loserID <= 0 || req.body.winnerID === req.body.loserID) {
    res.status(400).send("Invalid paramters")
  }

  const dbClient = new Client({
    connectionString: process.env.DATABASE_URL || devDBUri,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  })
  void dbClient.connect()

  const userSelectQuery = 'SELECT * FROM users WHERE id IN ($1, $2)'
  const userSelectParams = [req.body.winnerID, req.body.loserID]
  let winner: User = {} as User
  let loser: User = {} as User

  await dbClient
    .query(userSelectQuery, userSelectParams)
    .then(data => {
      winner = data.rows[0] as User
      loser = data.rows[1] as User
    })
    .catch(err => {
      console.error(err)
      res.status(400).send()
    })

  const diffRate = calcRate(winner.rating, loser.rating)

  const rateUpdateQuery = 'UPDATE users SET rating = $1 WHERE id = $2'
  const winnerRateUpdateParams = [winner.rating + diffRate, winner.id]
  const loserRateUpdateParams = [loser.rating - diffRate, loser.id]

  await dbClient.query(rateUpdateQuery, winnerRateUpdateParams)
  await dbClient.query(rateUpdateQuery, loserRateUpdateParams)

  await dbClient
    .query(userSelectQuery, userSelectParams)
    .then(data => {
      const winner = data.rows[0] as User
      const loser = data.rows[1] as User
      res.send({
        winnerID: winner.id,
        winnerRating: winner.rating,
        loserID: loser.id,
        loserRating: loser.rating,
      })
    })
    .catch(err => {
      console.error(err)
      res.status(400).send()
    })
    .finally(() => void dbClient.end())
})

export { calcRate }
export { router as userRouter }
