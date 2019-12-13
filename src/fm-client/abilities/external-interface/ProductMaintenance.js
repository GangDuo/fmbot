const fmww = require('../../core/fmwwService')
const AbstractSinglePage = require('../../components/AbstractSinglePage')
const debug = require('../../../diagnostics/debug')
const MenuContext = require('../../components/MenuContext')

/*
 * /外部インターフェース:対HT/商品マスタメンテナンス/ 
 */
module.exports = class ProductMaintenance extends AbstractSinglePage {
  constructor(page) {
    super(page)
    this.items_ = null
  }

  get items() {
    return this.items_
  }

  async enable() {
    debug.log('ProductMaintenance.enable')
    await fmww.decideMenuItem(this.page, new MenuContext(14, 1, 4, 3))
    this.items_ = await fmww.fetchItems(this.page)
    return true
  }

  async search(options) {
    debug.log('ProductMaintenance.search')
    await fmww.downloadProductsExcel(this.page, options)
    return {jan: options.barcode}
  }

  create() {
    debug.log('ProductMaintenance.create')
    return true
  }

  update() {
    debug.log('ProductMaintenance.update')
    return true
  }

  delete() {
    debug.log('ProductMaintenance.delete')
    return true
  }
}