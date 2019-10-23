const debug = require('../../../../diagnostics/debug')
const AbstractSinglePage = require('../../../components/AbstractSinglePage')
const fmww = require('../../../core/fmwwService')
const MenuContext = require('../../../components/MenuContext')

const CREATE_BUTTON = 2
const INDEX_BUTTON = 3
const EDIT_BUTTON = 4

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
    await this.clickOnMenu_(INDEX_BUTTON)
    const xs = await fmww.promotions(this.page, options)
    await this.backToMainMenu_()
    return xs
  }

  async create(options) {
    await this.clickOnMenu_(CREATE_BUTTON)
    await fmww.createPromotion(this.page, options)
    return true
  }

  async update() {
    await this.clickOnMenu_(EDIT_BUTTON)
    await this.backToMainMenu_()
    return true
  }

  async delete() {
    await this.clickOnMenu_(EDIT_BUTTON)
    await this.backToMainMenu_()
    return true
  }

  async clickOnMenu_(button) {
    await fmww.decideMenuItem(this.page, new MenuContext(7, 2, 4, button))
  }

  async backToMainMenu_() {
    await fmww.back(this.page)
  }
}