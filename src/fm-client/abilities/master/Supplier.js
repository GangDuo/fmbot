const fmww = require('../../core/fmwwService')
const AbstractSinglePage = require('../../components/AbstractSinglePage')
const debug = require('../../../diagnostics/debug')
const MenuItem = require('../../components/MenuItem')
const Native = require('../../components/Native');
const ButtonSymbol = require('../../core/ButtonSymbol');
const {writeFileAsync} = require('../../components/Helpers');

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
    const result = await this.updateSupplier_(options)
    await super.backToMainMenu()
    return result
  }

  delete() {
    debug.log('Supplier.delete')
  }

  async export(options) {
    debug.log('Supplier.export')
    await super.clickOnMenu(MENU_ITEM, SEARCH_BUTTON)
    const result = await this.exportSupplier_(options)
    await super.backToMainMenu()
    return result
  }

  async updateSupplier_(options) {
    const page = super.page

    if(!options.id) {
      throw new Error('')
    }
    await page.evaluate(x => {
      ['sup_cd_from', 'sup_cd_to'].forEach((id) => {
        document.getElementById(id).value = x
      })
    }, options.id)
    await page.evaluate(Native.performClick(), ButtonSymbol.SEARCH)
    await super.waitUntilLoadingIsOver()
    // 仕入先一覧の先頭行をクリック
    await page.evaluate(_ => document.querySelector('table.body_table tr:nth-child(2) td').click())
    await super.waitUntilLoadingIsOver()
    // 編集
    await page.evaluate(supplierName => {
      if(supplierName) {
        document.getElementById('sup_nm').value = supplierName  // 名称
      }
    }, options.supplierName)
    // 確認ダイアログ無効
    await page.evaluate(Native.disableConfirmationDialog)
    // 保存
    await page.evaluate(Native.performClick(), ButtonSymbol.REGISTER)
    await super.waitUntilLoadingIsOver()
    const result = await super.getDisplayedErrorMessage()
    // 仕入先一覧ページへ戻る
    await page.evaluate(Native.performClick(), ButtonSymbol.QUIT)
    await super.waitUntilLoadingIsOver()
    // 仕入先検索ページへ戻る
    await page.evaluate(Native.performClick(), ButtonSymbol.QUIT)
    await super.waitUntilLoadingIsOver()
    return {
      message: result
    }
  }
  
  async exportSupplier_(options) {
    const page = super.page
    await page.evaluate(Native.performClick(), ButtonSymbol.CSV)
    await super.waitUntilLoadingIsOver()
  
    // ダウンロード処理
    const uint8 = await fmww.download(super.page)
    const xs = Object.keys(uint8).map(key => uint8[key])
    const content = Buffer.from(xs)
    // encodingをnullにして、生データのまま書き込む
    await writeFileAsync(options.filename, content, {encoding: null});
    await super.closeDownloadBox()
    return Promise.resolve(true)
  }
}