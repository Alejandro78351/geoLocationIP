class Rate {
  constructor (name, value, date) {
    this._name = name
    this._value = value
    this._date = date
  }

  /**
   * get name
   */
  get name () {
    return this._name
  }

  /**
   * get value
   */
  get value () {
    return this._value
  }

  /**
   * get date
   */
  get date () {
    return this._date
  }
}

module.exports = Rate
