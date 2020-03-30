const debug = require('../../../../diagnostics/debug')
const AbstractSinglePage = require('../../../components/AbstractSinglePage')
const Native = require('../../../components/Native');
const ButtonSymbol = require('../../../components/ButtonSymbol');
const MenuItem = require('../../../components/MenuItem')
const {sleep} = require('../../../components/Helpers');

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
    const result = await this.createPoints_(options)
    await super.backToMainMenu()
    return result
  }

  async update() {
    await super.clickOnMenu(MENU_ITEM, EDIT_BUTTON)
    await super.backToMainMenu()
    return true
  }

  async createPoints_(options) {
    const page = super.page
    const items = [['pointCd', 'membershipNumber'], // 会員番号
                   ['destCd', 'storeCode'],         // 発行店舗
                   ['personCd', 'owner'],           // 入力担当者
                   ['addpoint', 'points'],          // 発行ポイント
                   ['reason', 'grounds']]           // 事由
    for(const item of items) {
      await page.evaluate((key, x) => document.getElementById(key).value = x, item[0], options[item[1]])
    }
    // hidden要素に値設定
    await page.evaluate(_ => seekPointCard())
    await sleep(1000)
    
    await page.evaluate(Native.performClick(), ButtonSymbol.REGISTER)
    await super.waitUntilLoadingIsOver()
    const message = await super.getDisplayedErrorMessage()
  
    return {
      options: options,
      isSuccess: RegExp('ポイント加算伝票\\[\\d*\\]を登録しました。').test(message),
      statusText: message
    }
  }
}