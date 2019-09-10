module.exports = class Nop {
  enable() {
    return new Promise(function(success, failure) {
      console.log('Nop.enable')
      setTimeout(() => success(true), 1000)
    })
  }

  search(op) {
    return new Promise(function(success, failure) {
      console.log('Nop.search')
      setTimeout(() => success({jan: op.jan}), 1000)
    })
  }

  create() {
     console.log('Nop.create')
  }

  update() {
     console.log('Nop.update')
  }

  delete() {
     console.log('Nop.delete')
  }
}