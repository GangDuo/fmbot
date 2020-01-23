const debug = require('../../../../diagnostics/debug')
const AbstractSinglePage = require('../../../components/AbstractSinglePage')
const fmww = require('../../../core/fmwwService')
const MenuItem = require('../../../components/MenuItem')

const EXECUTION_BUTTON = 2
const MENU_ITEM = new MenuItem(10, 2, 2)

/*
 * /在庫・棚卸:棚卸/棚卸更新/
 */
module.exports = class Schedule extends AbstractSinglePage {
  constructor(page) {
    super(page)
  }

  enable() {
    debug.log('Schedule.enable')
    return false
  }

  async create(options) {
    await super.clickOnMenu(MENU_ITEM, EXECUTION_BUTTON)
    return await fmww.applyInventory(this.page, options)
  }
}