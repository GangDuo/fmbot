const debug = require('../../../../diagnostics/debug')
const AbstractSinglePage = require('../../../components/AbstractSinglePage')
const fmww = require('../../../core/fmwwService')
const MenuItem = require('../../../components/MenuItem')

const CREATE_BUTTON = 2
const INDEX_BUTTON = 3
const EDIT_BUTTON = 4
const MENU_ITEM = new MenuItem(7, 2, 4)

/*
 * /店舗管理:店舗顧客/ポイント設定/
 */
module.exports = class Promotion extends AbstractSinglePage {
  constructor(page) {
    super(page)
  }

  enable() {
    debug.log('Promotion.enable')
    return false
  }

  async search(options) {
    await super.clickOnMenu(MENU_ITEM, INDEX_BUTTON)
    const xs = await fmww.promotions(this.page, options)
    await super.backToMainMenu()
    return xs
  }

  async create(options) {
    await super.clickOnMenu(MENU_ITEM, CREATE_BUTTON)
    await fmww.createPromotion(this.page, options)
    return true
  }

  async update() {
    await super.clickOnMenu(MENU_ITEM, EDIT_BUTTON)
    await super.backToMainMenu()
    return true
  }

  async delete() {
    await super.clickOnMenu(MENU_ITEM, EDIT_BUTTON)
    await super.backToMainMenu()
    return true
  }
}