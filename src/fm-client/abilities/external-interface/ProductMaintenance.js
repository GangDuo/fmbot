const path = require('path');
const fmww = require('../../core/fmwwService')
const AbstractSinglePage = require('../../components/AbstractSinglePage')
const debug = require('../../../diagnostics/debug')
const MenuContext = require('../../components/MenuContext')
const Native = require('../../components/Native');
const ButtonSymbol = require('../../core/ButtonSymbol');
const MenuItem = require('../../components/MenuItem')
const {writeFileAsync} = require('../../components/Helpers');

const INDEX_BUTTON = 3
const MENU_ITEM = new MenuItem(14, 1, 4)

/*
 * /外部インターフェース:対HT/商品マスタメンテナンス/ 
 */
module.exports = class ProductMaintenance extends AbstractSinglePage {
  constructor(page) {
    super(page)
    this.items_ = null
  }

  get items() {
    return this.items_
  }

  async enable() {
    debug.log('ProductMaintenance.enable')
    await super.clickOnMenu(MENU_ITEM, INDEX_BUTTON)
    this.items_ = await this.fetchItems_()
    return true
  }

  async search(options) {
    debug.log('ProductMaintenance.search')
    await this.downloadProductsExcel_(options)
    return {jan: options.barcode}
  }

  create() {
    debug.log('ProductMaintenance.create')
    return true
  }

  update() {
    debug.log('ProductMaintenance.update')
    return true
  }

  delete() {
    debug.log('ProductMaintenance.delete')
    return true
  }

  // 部門コード全取得
  // 戻り値：[[部門コード,部門名]]
  async fetchItems_() {
    const page = super.page
    return await page
      .evaluate(async () => {
        return Array.from(document.getElementById('item_list:select').children).map(a => a.textContent.split(/\s+/))
      }, {timeout: 0})
  }

  // 検索条件にマッチする商品マスタエクセルをローカル保存して、検索条件入力画面に戻す
  async downloadProductsExcel_(options) {
    const page = super.page
    const itemCode = options.itemCode || ''
    const barcode = options.barcode || ''
    const prefix = options.prefix ? options.prefix : (itemCode ? itemCode + '_' : barcode + '_')
    const filename = prefix + 'products.xlsx'

    await page.evaluate(x => document.getElementById('item_list').value = x, itemCode)
    await page.evaluate(x => document.getElementById('barcode').value = x, barcode)
    await page.evaluate(Native.performClick(), ButtonSymbol.EXCEL)
    await super.waitUntilLoadingIsOver()
    await page.screenshotIfDebug({ path: 'is_ready_to_download_' + filename + '.png' });

    // ダウンロード処理
    const uint8 = await fmww.download(page)
    const xs = Object.keys(uint8).map(key => uint8[key])
    const content = Buffer.from(xs)
    // encodingをnullにして、生データのまま書き込む
    await writeFileAsync(path.join(options.saveTo, filename), content, {encoding: null});
    await super.closeDownloadBox()
  }
}