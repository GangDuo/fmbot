const fmww = require('../../../../fmwwService')
const AbstractSinglePage = require('../../components/AbstractSinglePage')
const debug = require('../../../diagnostics/debug')
const MenuContext = require('../../components/MenuContext')

/*
 * /マスター:各種マスター/仕入先マスター/
 */
module.exports = class Supplier extends AbstractSinglePage {
  constructor(page) {
    super(page)
  }

  async enable() {
    debug.log('Supplier.enable')
    await fmww.decideMenuItem(this.page, new MenuContext(12, 2, 4, 4))
    return true
  }

  /**
   * id:
   * supplierName:
   * officialName:
   */
  search(options) {
    debug.log('Supplier.search')
  }

  create() {
    debug.log('Supplier.create')
  }

  async update(options) {
    debug.log('Supplier.update')
    return await fmww.updateSupplier(this.page, options)
  }

  delete() {
    debug.log('Supplier.delete')
  }
}