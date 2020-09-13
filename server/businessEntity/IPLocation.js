const Country = require('./Country')

class IPLocation {
  constructor (ip, countryName, countryCode, isBlackListed) {
    this._ip = ip
    this._isBlackListed = isBlackListed
    this._country = new Country(countryName, countryCode)
  }

  /**
   * get Ip
   */
  get ip () {
    return this._ip
  }

  /**
   * get isBlackListed
   */
  get isBlackListed () {
    return this._isBlackListed
  }

  /**
   * get countryCode
   */
  get country () {
    return this._country
  }
}

module.exports = IPLocation
