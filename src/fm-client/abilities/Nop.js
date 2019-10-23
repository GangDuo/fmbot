const AbstractSinglePage = require('../components/AbstractSinglePage')
const debug = require('../../diagnostics/debug')

module.exports = class Nop extends AbstractSinglePage {
  enable() {
    return new Promise(function(success, failure) {
      debug.log('Nop.enable')
      setTimeout(() => success(true), 1000)
    })
  }

  search(op) {
    return new Promise(function(success, failure) {
      debug.log('Nop.search')
      setTimeout(() => success({jan: op.jan}), 1000)
    })
  }

  create() {
    debug.log('Nop.create')
  }

  update() {
    debug.log('Nop.update')
  }

  delete() {
    debug.log('Nop.delete')
  }
}