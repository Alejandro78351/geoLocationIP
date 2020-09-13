const debug = require('debug')('back:redis')
const Redis = require('ioredis')

const redisClient = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  keyPrefix: process.env.REDIS_KEY
})

redisClient.on('ready', () => debug('Redis ready'))
redisClient.on('connect', () => debug('Redis connected'))

module.exports = redisClient
