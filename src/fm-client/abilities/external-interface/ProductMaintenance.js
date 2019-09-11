const fmww = require('../../../../fmwwService')
const PageProperty = require('../../components/PageProperty')
const debug = require('../../../diagnostics/debug')

module.exports = class ProductMaintenance extends PageProperty {
  static get path() {
    return '/外部インターフェース:対HT/商品マスタメンテナンス/'
  }

  constructor(page) {
    super(page)
  }

  async enable() {
    debug.log('ProductMaintenance.enable')
    await fmww.decideMenuItem(this.page)
    return true
  }

  async search(options) {
    debug.log('ProductMaintenance.search')
    await fmww.downloadProductsExcel(this.page, options)
    return {jan: options.barcode}
  }

  create() {
    debug.log('ProductMaintenance.create')
  }

  update() {
    debug.log('ProductMaintenance.update')
  }

  delete() {
    debug.log('ProductMaintenance.delete')
  }
}