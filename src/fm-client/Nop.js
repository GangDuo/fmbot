const Promiseable = require('./Promiseable')

module.exports = class Nop extends Promiseable {
  constructor(queue) {
    super(queue)
  }

  search(op) {
     this.enqueue(async () => {
      return new Promise(function(success, failure) {
        console.log('search')
        setTimeout(() => success({jan: op.jan}), 1000)
      })
    })
    return this
  }

  create() {
     console.log('create')
  }

  update() {
     console.log('update')
  }

  delete() {
     console.log('delete')
  }
}