module.exports = class ProductMaintenance {
  static get path() {
    return '/外部インターフェース:対HT/商品マスタメンテナンス/'
  }

  search(op) {
    return new Promise(function(success, failure) {
      console.log('ProductMaintenance.search')
      setTimeout(() => success({jan: op.jan}), 1000)
    })
  }

  create() {
    console.log('ProductMaintenance.create')
  }

  update() {
    console.log('ProductMaintenance.update')
  }

  delete() {
    console.log('ProductMaintenance.delete')
  }
}