const request = require('supertest')
const server = require('../api/server')
const db = require('../database/dbConfig')

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


  describe('login endpoint', () => {
    it('gives a successful status code', async () => {
      await request(server).post('/api/auth/login')
      .send({username: 'homer', password: 'simpson'})
      .then(res =>{
          expect(res.statusCode).toBe(200)
      })
    })
    it('gives welcome message', async () => {
      await request(server).post('api/auth/login')
      .send({username:'homer', password: 'simpson'})
      .then(res =>{
          expect(res.body).toEqual({message: 'Wilkomen meinen damen und heren!'})
      })
    })
  })



})




