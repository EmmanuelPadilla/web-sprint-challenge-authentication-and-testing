const { default: expectCt } = require('helmet/dist/middlewares/expect-ct')
const request = require('supertest')
const server = require('../api/server')
const db = require('../database/dbConfig')
const jwt = require('jsonwebtoken');

describe('auth router', () => {

// this will truncate and reset db
  beforeEach(async () => {
    await db('users').truncate()
  })

  describe('testing registration', () => {
    it('should add new user', async () => {
      const testOne = await db('users')
      expect(testOne).toHaveLength(0)

      await request(server).post("/api/auth/register").send({
          username: "bart",
          password: "simpson"
      })
      const testTwo = await db('users')
      expect(testTwo).toHaveLength(1)

      await db('users').truncate() //for good measure
    })
  })

  describe('testing POST loggin', async () => {
    it('allows users to login', async () => {
      const loginTestOne = await db('users')
      expect(loginTestOne).toHaveLength(0)

      await request(server).post("api/auth/register").send({
          username: 'bart',
          password: "simpson"
      })
      const loginTestTwo = await db('users')
      expect(loginTestTwo).toHaveLength(1)
      expect(loginTestTwo[0].username).toMatch('bart')
      const token = res.body.token

      let response = await request(server). post('/api/auth/login').send({
          username:'bart',
          password : 'simpson'
      })
      expect(response).objectContaining(token)
    })
  })

})




