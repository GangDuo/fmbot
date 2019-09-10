module.exports = class Nop {
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