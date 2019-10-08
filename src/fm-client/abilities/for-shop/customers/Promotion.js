const debug = require('../../../../diagnostics/debug')
const AbstractSinglePage = require('../../../components/AbstractSinglePage')
const fmww = require('../../../../../fmwwService')
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
    return true
  }

  async create() {
    await this.clickOnMenu_(CREATE_BUTTON)
    return true
  }

  async update() {
    await this.clickOnMenu_(EDIT_BUTTON)
    return true
  }

  async delete() {
    await this.clickOnMenu_(EDIT_BUTTON)
    return true
  }

  async clickOnMenu_(button) {
    await fmww.decideMenuItem(this.page, new MenuContext(7, 2, 4, button))
  }
}