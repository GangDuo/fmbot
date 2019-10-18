const FmClient = require('../../../FmClient');
const Promotion = require('../../../abilities/for-shop/customers/Promotion')
const Between = require('../../../components/Between')

module.exports = class PromotionController {
  static async search(options) {
    const c = new FmClient()
    const ability = await c
      .open(process.env.FMWW_SIGN_IN_URL)
      .signIn({
        FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
        FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
        FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
        FMWW_PASSWORD          : process.env.FMWW_PASSWORD
      })
      .createAbility(Promotion)

    const response = await c.search(new Between(options.beginDate, options.endDate))
    await c.quit()

    process.stdout.write(JSON.stringify(response, null, 2))
  }

  static create(options) {
    console.log(options.beginDate)
    console.log(options.endDate)
    console.log(options.storeCodes)
    console.log(options.rate)
  }
}