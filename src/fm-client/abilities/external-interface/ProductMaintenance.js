const fmww = require('../../../../fmwwService')
const PageProperty = require('../../components/PageProperty')

module.exports = class ProductMaintenance extends PageProperty {
  static get path() {
    return '/外部インターフェース:対HT/商品マスタメンテナンス/'
  }

  constructor(page) {
    super(page)
  }

  async search(options) {
    console.log('ProductMaintenance.search')
    await fmww.decideMenuItem(this.page)
    await fmww.downloadProductsExcel(this.page, options)
    return {jan: options.barcode}
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