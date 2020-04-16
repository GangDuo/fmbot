const fmww = require('../core/fmwwService')
const MenuContext = require('./MenuContext')

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
    await fmww.back(this.page)
  }
}