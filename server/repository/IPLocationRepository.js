const IPLocationModel = require('../model/IPLocationModel')
const converter = require('../converter/IPLocationConverter')
const redisClient = require('../utils/redis')

/**
 *
 * @param {*} ip ip
 */
async function findIPLocation (ip) {
  let ipRedis = await redisClient.get(`ip_location_${ip}`)
  if (ipRedis) {
    ipRedis = JSON.parse(ipRedis)
    return converter.convertFromRedis(ipRedis)
  }
  const models = await IPLocationModel.find({ ip })
  if (models && models.length > 0) {
    const ipLocation = converter.convertFromModel(models[0])
    await redisClient.set(`ip_location_${ip}`, JSON.stringify(ipLocation))
    return ipLocation
  } else {
    return undefined
  }
}

/**
 *
 *
 *
 * @param {*} ipLocation
 */
async function saveIPLocation (ip, isblackListed, countryName, countryCode, trm) {
  const ipLocationModel = new IPLocationModel({ ip, isblackListed, country: { name: countryName, code: countryCode, trm } })
  await saveModel(ipLocationModel)
  const ipLocation = converter.convertFromModel(ipLocationModel)
  await redisClient.set(`ip_location_${ip}`, JSON.stringify(ipLocation))
  return ipLocation
}

/**
 *
 * @param {*} model
 */
function saveModel (ipLocationModel) {
  return new Promise((resolve, reject) => {
    ipLocationModel.save(function (err) {
      if (!err) {
        resolve()
      } else {
        reject(err)
      }
    })
  })
}

/**
 *
 * @param {*} ipLocation IPLocation
 */
async function updateIpLocation ({ ip, ...rest }) {
  const models = await IPLocationModel.find({ ip })
  if (models && models.length > 0) {
    await redisClient.del(`ip_location_${ip}`)
    const model = await updateModel({ ip, ...rest })
    return converter.convertFromModel(model)
  } else {
    const err = new Error('Ip has not been created')
    throw err
  }
}

/**
 *
 * @param {*} param0
 */
function updateModel ({ ip, ...rest }) {
  return new Promise((resolve, reject) => {
    IPLocationModel.updateOne({ ip }, { ...rest }, function (err, res) {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = {
  findIPLocation,
  saveIPLocation,
  updateIpLocation,
  saveModel,
  updateModel
}