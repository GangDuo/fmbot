const fmww = require('../core/fmwwService')
const MenuContext = require('./MenuContext')
const Native = require('./Native');
const ButtonSymbol = require('./ButtonSymbol');
const {sleep} = require('./Helpers');
const debug = require('../../diagnostics/debug')

module.exports = class AbstractSinglePage {
  get page() {
    return this.page_
  }

  set page(v) {
    this.page_ = v
  }

  constructor(page) {
    this.page = page;
  }

  enable() {
    throw new Error('Not Implemented')
  }

  search(options) {
    throw new Error('Not Implemented')
  }

  create() {
    throw new Error('Not Implemented')
  }

  update() {
    throw new Error('Not Implemented')
  }

  delete() {
    throw new Error('Not Implemented')
  }

  export() {
    throw new Error('Not Implemented')
  }

  async clickOnMenu(menuItem, button) {
    await this.decideMenuItem_(new MenuContext(menuItem, button))
  }

  async backToMainMenu() {
    await this.back()
  }

  async getDisplayedErrorMessage() {
    const page = this.page
    return await page.evaluate(_ => document.getElementById('form1:errorMessage').textContent)
  }
  
  async waitUntilLoadingIsOver() {
    const page = this.page
    const  disableTimeout = {timeout: 0}
    await page.waitFor(() => !!document.querySelector('#loading'), disableTimeout)
    await page.waitFor(() => document.querySelector('#loading').style.display === 'none', disableTimeout)
  }

  async back() {
    const page = this.page
    await Promise.all([
      page.evaluate(Native.performClick(), ButtonSymbol.QUIT),
      page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'})
    ])
  }

  async closeDownloadBox() {
    const page = this.page
    // 閉じるボタンをクリックして、非表示にしている検索条件入力画面を表示する
    await page.evaluate(_ => document.querySelector('div.excelDLDiv input[name=cls]').click())
    await sleep(500)
  }

  async decideMenuItem_(context) {
    const page = this.page
    const catergory = context.catergory
    const subcatergory = context.subcatergory
    const command = context.command
    const action = context.action
  
    // 外部インターフェース -> 対HT -> 商品マスタメンテナンス -> 照会
    await page.waitForSelector('#menu\\:0 div:nth-child(' + catergory + ')')
    await page.evaluate((catergory, subcatergory) => {
      document.querySelector('#menu\\:0 div:nth-child(' + catergory + ')').click()
      document.querySelector('#menu\\:1 div:nth-child(' + subcatergory + ')').click()
    }, catergory, subcatergory),
    await page.waitForSelector('#menu\\:2 div:nth-child(' + command + ') div:nth-child(' + action + ')')
    debug.log('menu')
    await page.screenshotIfDebug({ path: 'menu.png' });
  
    await Promise.all([
      page.evaluate((command, action) => {
        document.querySelector('#menu\\:2 div:nth-child(' + command + ') div:nth-child(' + action + ')').click()
      }, command, action),
      page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'})
    ])
    await this.waitUntilLoadingIsOver()
    debug.log('criteria')
    await page.screenshotIfDebug({ path: 'criteria.png' });
  }  
}