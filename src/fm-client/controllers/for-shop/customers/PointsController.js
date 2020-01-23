const FmClient = require('../../../FmClient');
const Points = require('../../../abilities/for-shop/customers/Points')

module.exports = class PointsController {
  static search(options) {
    console.log('PointsController.search')
  }

  static async create(options) {
    const c = new FmClient()
    const response = await c
      .open(process.env.FMWW_SIGN_IN_URL)
      .signIn({
        FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
        FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
        FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
        FMWW_PASSWORD          : process.env.FMWW_PASSWORD
      })
      .createAbility(Points)
      .create({
        membershipNumber: options.membershipNumber,
        storeCode: options.storeCode,
        owner: options.owner,
        points: options.points,
        grounds: '04'
      })
    await c.quit()
    console.log(response.isSuccess ? 'Success' : response.statusText)
  }
}