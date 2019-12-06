const fmww = require('../../core/fmwwService')
const AbstractSinglePage = require('../../components/AbstractSinglePage')
const debug = require('../../../diagnostics/debug')
const MenuItem = require('../../components/MenuItem')

const CREATE_BUTTON = 2
const SEARCH_BUTTON = 3
const EDIT_BUTTON = 4
const MENU_ITEM = new MenuItem(12, 2, 4)

/*
 * /マスター:各種マスター/仕入先マスター/
 */
module.exports = class Supplier extends AbstractSinglePage {
  constructor(page) {
    super(page)
  }

  async enable() {
    debug.log('Supplier.enable')
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
    await super.clickOnMenu(MENU_ITEM, EDIT_BUTTON)
    const result = await fmww.updateSupplier(this.page, options)
    await super.backToMainMenu()
    return result
  }

  delete() {
    debug.log('Supplier.delete')
  }

  async export(options) {
    debug.log('Supplier.export')
    await super.clickOnMenu(MENU_ITEM, SEARCH_BUTTON)
    const result = await fmww.exportSupplier(this.page, options)
    await super.backToMainMenu()
    return result
  }
}