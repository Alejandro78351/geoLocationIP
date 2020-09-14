const IPLocation = require('../businessEntity/IPLocation')
const constants = require('../utils/constants')

/**
 * convert model into businees entity
 * @param {*} model
 */
function convertFromModel (model) {
  let ipLocation
  if (model.country) {
    ipLocation = new IPLocation(model.ip, model.country.name, model.country.code, model.isblackListed)
    if (model.country.trm) {
      ipLocation.country.trm = model.country.trm.base
      const rates = model.country.trm.rates
      for (let index = 0; index < rates.length; index++) {
        ipLocation.country.trm.addRate(rates[index].rate, rates[index].value)
      }
    }
  } else {
    ipLocation = new IPLocation(model.ip, constants.NA, constants.NA, model.isblackListed)
  }
  return ipLocation
}

/**
 * convert reedis response into businees entity
 * @param {*} ipRedis
 */
function convertFromRedis (ipRedis) {
  let ipLocation
  if (ipRedis._country) {
    ipLocation = new IPLocation(ipRedis._ip, ipRedis._country._name, ipRedis._country._code, ipRedis._isBlackListed)
    if (ipRedis._country._trm) {
      ipLocation.country.trm = ipRedis._country._trm._base
      const rates = ipRedis._country._trm._rate
      for (let index = 0; index < rates.length; index++) {
        ipLocation.country.trm.addRate(rates[index]._name, rates[index]._value)
      }
    }
  } else {
    ipLocation = new IPLocation(ipRedis._ip, constants.NA, constants.NA, ipRedis._isBlackListed)
  }
  return ipLocation
}

module.exports = {
  convertFromModel,
  convertFromRedis
}
