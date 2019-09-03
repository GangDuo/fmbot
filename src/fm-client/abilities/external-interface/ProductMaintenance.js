const Promiseable = require('../../Promiseable')

module.exports = class ProductMaintenance extends Promiseable {
  static get path() {
    return '/外部インターフェース:対HT/商品マスタメンテナンス/'
  }

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
    return this
  }

  update() {
    console.log('update')
    return this
  }

  delete() {
    console.log('delete')
    return this
  }
}