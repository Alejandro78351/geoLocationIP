const TRM = require('./Trm')

class Country {
  constructor (name, code) {
    this._name = name
    this._code = code
    this._trm = undefined
  }

  /**
   * get code
   */
  get code () {
    return this._code
  }

  /**
   * get name
   */
  get name () {
    return this._name
  }

  /**
   * get trm
   */
  get trm () {
    return this._trm
  }

  /**
   * Set trm
   */
  set trm (base) {
    this._trm = new TRM(base)
  }
}

module.exports = Country
