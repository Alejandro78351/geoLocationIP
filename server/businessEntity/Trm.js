const Rate = require('./Rate')

class TRM {
  constructor (base) {
    this._base = base
    this._rate = []
  }

  /**
   * get base
   */
  get base () {
    return this._base
  }

  /**
   * get rate
   */
  get rate () {
    return this._rate
  }

  /**
   * Add rate
   * @param {A} name
   * @param {*} value
   */
  addRate (name, value) {
    this._rate.push(new Rate(name, value))
  }
}

module.exports = TRM
