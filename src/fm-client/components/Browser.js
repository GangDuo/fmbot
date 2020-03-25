const puppeteer = require('puppeteer');

function debugOf(page) {
  const isDebug = false
  page.screenshotIfDebug = isDebug ? page.screenshot : () => { return Promise.resolve() }
  return page
}

module.exports = class Browser {
  get raw() { return this.browser }
  get page() { return this.page_ }
  
  launch() {
    return new Promise(async (success, failure) => {
      try{
        const browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=500,500',
          ]
        });
        this.browser = browser
        success()
      } catch (err) {
        failure(err)
      }
    })
  }

  async close() {
    await this.browser.close()
  }

  async newPage() {
    this.page_ = debugOf(await this.browser.newPage())
  }
}