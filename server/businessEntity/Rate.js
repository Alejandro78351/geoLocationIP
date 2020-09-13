class Rate {
  constructor (name, value) {
    this._name = name
    this._value = value
  }

  /**
     * get rate
     */
  get name () {
    return this._name
  }

  get value () {
    return this._value
  }
}

module.exports = Rate
