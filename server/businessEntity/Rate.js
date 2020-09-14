class Rate {
  constructor (name, value) {
    this._name = name
    this._value = value
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
}

module.exports = Rate
