const debug = require('../../../../diagnostics/debug')
const AbstractSinglePage = require('../../../components/AbstractSinglePage')
const MenuItem = require('../../../components/MenuItem')
const Native = require('../../../components/Native');
const ButtonSymbol = require('../../../components/ButtonSymbol');

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
    return await this.applyInventory_(options)
  }

  async applyInventory_(options) {
    const page = super.page
    await page.evaluate(x => document.getElementById('stocktaking_date').value = x, options.stocktakingDate)// "yyyy年m月d日"
    await page.evaluate(x => document.getElementById('location:dest').value = x, options.storeCodes.join('\t'))
    if(options.zeroFill) {
      // 実棚にないSKUの更新
      await page.evaluate(_ => document.getElementById('form1:check01').click())
    }
    // 常に在庫テーブル更新しない
    await page.evaluate(_ => document.getElementById('stockTableUpdate').value = 1)
  
    await page.evaluate(Native.disableConfirmationDialog)
    await page.evaluate(Native.performClick(), ButtonSymbol.EXECUTE)
    await super.waitUntilLoadingIsOver()
    const message = await super.getDisplayedErrorMessage()
    return {
      isSuccess: "棚卸更新を実行し、差異伝票を作成しました。" === message,
      statusText: message
    }
  }
}