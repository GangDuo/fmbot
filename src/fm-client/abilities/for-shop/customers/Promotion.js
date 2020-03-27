const debug = require('../../../../diagnostics/debug')
const AbstractSinglePage = require('../../../components/AbstractSinglePage')
const fmww = require('../../../core/fmwwService')
const Native = require('../../../components/Native');
const ButtonSymbol = require('../../../core/ButtonSymbol');
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
    const xs = await this.promotions_(options)
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

  async promotions_(between) {
    const page = super.page
    await page.evaluate((from, to) => {
      // 設定日付
      document.getElementById('date_from').value = from
      document.getElementById('date_to').value = to
      document.getElementById('search_button').click()
    }, between.from, between.to)
    await super.waitUntilLoadingIsOver()
  
    // 設定番号すべてを取得
    const settingNumbers = await page.evaluate(_ => {
      // テーブルに表示するデータソース、[row][clm]の2次元配列
      const rows = document.getElementById('list').native
      return (rows.length === 0) ? [] : rows.map(row => row[0].value)
    })
    await page.evaluate(Native.performClick(), ButtonSymbol.QUIT)
    await super.waitUntilLoadingIsOver()
  
    let settings = []
    // 1行づつ詳細ページを開き設定情報を取得する
    for (const settingNumber of settingNumbers) {
      await page.evaluate((settingNumber) => {
        document.getElementById('number').value = settingNumber
        document.getElementById('search_button').click()
      }, settingNumber, {timeout: 0})
      await super.waitUntilLoadingIsOver()
  
      await page.evaluate(_ => {
        const table = document.querySelector("#list div.body_div table")
        // 先頭行クリックして詳細を表示
        table.rows[1].cells[0].click()
      })
      await super.waitUntilLoadingIsOver()
  
      // 設定情報を取得
      const info = await page.evaluate((settingNumber) => {
        return {
          settingNumber: settingNumber,
          priority: document.getElementById('setSeq').value,
          between: {
            from: document.getElementById('dateFrom').value,
            to: document.getElementById('dateTo').value
          },
          selected: Array.from(document.querySelectorAll("#dest\\:SELECT span[selected=selected]")).map(x => x.textContent),
          unit: document.getElementById('input_7:0').value, // 単位（円）
          rate: document.getElementById('input_8:0').value, // レート
        }
      }, settingNumber)
      settings.push(info)
  
      // 一覧画面に戻る
      await super.back()
      // 検索条件入力画面に戻る
      await super.back()
    }
    return settings
  }
}