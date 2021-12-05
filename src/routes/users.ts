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

export { router as userRouter }
