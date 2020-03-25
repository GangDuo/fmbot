const AbstractSinglePage = require('../components/AbstractSinglePage')
const debug = require('../../diagnostics/debug')
const Native = require('../components/Native')

module.exports = class Auth extends AbstractSinglePage {
  constructor(page) {
    super(page)
  }

  async signIn(user) {
    const page = super.page
    const user_ = user || {
      FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
      FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
      FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
      FMWW_PASSWORD          : process.env.FMWW_PASSWORD
    }

    await page.waitForSelector('#form1\\:client')
    await Promise.all([
      page.evaluate(Native.signIn, user_),
      page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'})
    ])
    debug.log('signined')
    await page.screenshotIfDebug({ path: 'signined.png' });
    return Promise.resolve(true)
  }
}