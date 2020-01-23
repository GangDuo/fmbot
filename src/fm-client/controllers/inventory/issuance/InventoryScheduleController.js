const FmClient = require('../../../FmClient');
const Schedule = require('../../../abilities/inventory/issuance/Schedule')

module.exports = class InventoryScheduleController {
  static async create(options) {
    const c = new FmClient()
    const ability = await c
      .open(process.env.FMWW_SIGN_IN_URL)
      .signIn({
        FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
        FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
        FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
        FMWW_PASSWORD          : process.env.FMWW_PASSWORD
      })
      .createAbility(Schedule)
    const response = await c.create({
      stocktakingDate: options.stocktakingDate || '',
      storeCodes: options.storeCodes || [],
      zeroFill: options.zeroFill || false
    })
    if(response.isSuccess) {
      process.stdout.write(`${response.statusText}\n`)
    } else {
      process.stderr.write(response.statusText)
    }
    await c.quit()
  }
}