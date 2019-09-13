const fmww = require('../../../../fmwwService')
const PageProperty = require('../../components/PageProperty')
const debug = require('../../../diagnostics/debug')
const MenuContext = require('../../components/MenuContext')

module.exports = class Supplier extends PageProperty {
  static get path() {
    return '/マスター:各種マスター/仕入先マスター/'
  }

  constructor(page) {
    super(page)
  }

  async enable() {
    debug.log('Supplier.enable')
    await fmww.decideMenuItem(this.page, new MenuContext(12, 2, 4, 4))
    return true
  }

  /**
   * supplierName:
   * officialName:
   */
  search(options) {
    debug.log('Supplier.search')
  }

  create() {
    debug.log('Supplier.create')
  }

  update() {
    debug.log('Supplier.update')
  }

  delete() {
    debug.log('Supplier.delete')
  }
}