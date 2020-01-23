const debug = require('../../../../diagnostics/debug')
const AbstractSinglePage = require('../../../components/AbstractSinglePage')
const fmww = require('../../../core/fmwwService')
const MenuItem = require('../../../components/MenuItem')

const CREATE_BUTTON = 2
const INDEX_BUTTON = 3
const EDIT_BUTTON = 4
const MENU_ITEM = new MenuItem(7, 2, 2)

/*
 * /店舗管理:店舗顧客/ポイント入力/
 */
module.exports = class Points extends AbstractSinglePage {
  constructor(page) {
    super(page)
  }

  enable() {
    debug.log('Points.enable')
    return false
  }

  async search(options) {
    await super.clickOnMenu(MENU_ITEM, INDEX_BUTTON)
    await super.backToMainMenu()
    return []
  }

  async create(options) {
    await super.clickOnMenu(MENU_ITEM, CREATE_BUTTON)
    const result = await fmww.createPoints(super.page, options)
    await super.backToMainMenu()
    return result
  }

  async update() {
    await super.clickOnMenu(MENU_ITEM, EDIT_BUTTON)
    await super.backToMainMenu()
    return true
  }
}