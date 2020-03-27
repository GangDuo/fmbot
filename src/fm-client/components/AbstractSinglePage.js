const fmww = require('../core/fmwwService')
const MenuContext = require('./MenuContext')
const Native = require('./Native');
const ButtonSymbol = require('../core/ButtonSymbol');

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
    await fmww.decideMenuItem(this.page, new MenuContext(menuItem, button))
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
}