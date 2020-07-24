
class fieldifySet {
  constructor () {
    this.sets = {}
  }

  load (name, fields) {
    if (this.sets[name]) return (this.sets[name])

    this.sets[name] = fields

    // load fields

    return (this.sets[name])
  }

  get (name) {
    return (this.sets[name])
  }
}

// one global instance
module.exports = new fieldifySet()
