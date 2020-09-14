const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')
let server
const redisClient = require('../../utils/redis')
const faker = require('faker')

describe('Get location IPs xx', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.URLDBTEST)
    await new Promise((resolve, reject) => {
      server = app.listen(process.env.PORT, () => {
        console.log('Port: ', process.env.PORT)
        resolve()
      })
    })
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await server.close()
    await redisClient.disconnect()
  })

  describe('Get location IPs', () => {
    const ip = faker.internet.ip()
    it('Get Ip location success', async () => {
      const res = await request(app)
        .get(`/v1/location/?ip=${ip}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('_ip')
      expect(res.body).toHaveProperty('_isBlackListed')
      expect(res.body).toHaveProperty('_country')
    })

    it('Register Ip in black list', async () => {
      const res = await request(app)
        .post('/v1/location/blackList')
        .send({ ip })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('_message')
      expect(res.body._message).toEqual('Success')
    })

    it('Get Ip location in black list', async () => {
      const res = await request(app)
        .get(`/v1/location/?ip=${ip}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('_message')
      expect(res.body._message).toEqual('IP in black list')
    })
  })

  describe('Get location IPs regiter IP in black list when ip has not ben created', () => {
    const ip = faker.internet.ip()
    it('Register Ip in black list', async () => {
      const res = await request(app)
        .post('/v1/location/blackList')
        .send({ ip })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('_message')
      expect(res.body._message).toEqual('Success')
    })

    it('Get Ip location success', async () => {
      const res = await request(app)
        .get(`/v1/location/?ip=${ip}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('_message')
      expect(res.body._message).toEqual('IP in black list')
    })

  })

})
