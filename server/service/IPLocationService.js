const ipLocationRepository = require('../repository/IPLocationRepository')
const axios = require('axios')
const constants = require('../utils/constants')

/**
 * Service get country and TRM given a IP address
 * @param {*} ip ip
 */
async function getIpLocation (ip) {
  let ipLocation = await ipLocationRepository.findIPLocation(ip)
  if (!ipLocation) {
    const infoApi = await getInfoAPis(ip)
    ipLocation = await ipLocationRepository.saveIPLocation(infoApi.ip, false, infoApi.countryName, infoApi.countryCode, infoApi.trm)
  }
  if (ipLocation.isBlackListed) {
    return { _message: 'IP in black list' }
  } else {
    return ipLocation
  }
}

/**
 * Register IP in black list
 * @param {*} ip ip
 */
async function registerIpBlackList (ip) {
  const ipParams = {
    ip,
    isblackListed: true
  }
  try {
    await ipLocationRepository.updateIpLocation(ipParams)
  } catch (error) {
    if (error.message === 'Ip has not been created') {
      await ipLocationRepository.saveIPLocation(ip, true, constants.NA, constants.NA, null)
    } else {
      throw error
    }
  }
  return { _message: 'Success' }
}

/**
 * Get Info Ip from external APIs
 * @param {*} ip
 */
async function getInfoAPis (ip) {
  let infoApi
  const ipCountry = await axios.get(`https://api.ip2country.info/ip?${ip}`)
  if (ipCountry) {
    const countryApi = await axios.get(`https://restcountries.eu/rest/v2/alpha/${ipCountry.data.countryCode}`)
    if (countryApi) {
      let currencies = countryApi.data.currencies.map(c => c.code)
      currencies = currencies.join(',')
      const trmsAPi = await axios.get(`http://data.fixer.io/api/latest?access_key=d3db283a0c4a599916f352d9b5cf0d16&symbols=${currencies}&format=1`)
      if (trmsAPi.data.success) {
        const ratesApi = trmsAPi.data.rates
        const rates = []
        for (const key in ratesApi) {
          rates.push({ rate: key, value: ratesApi[key] })
        }
        const trm = { base: trmsAPi.data.base, rates }
        infoApi = { ip, countryName: ipCountry.data.countryName, countryCode: ipCountry.data.countryCode, trm }
      }
    }
  }
  if (!infoApi) {
    const err = new Error('Ip not found')
    err.status = 500
    throw err
  }
  return infoApi
}

module.exports = {
  getIpLocation,
  registerIpBlackList,
  getInfoAPis
}
