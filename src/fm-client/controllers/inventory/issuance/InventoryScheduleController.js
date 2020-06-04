const {FmClient, Schedule} = require('fmww-library');

module.exports = class InventoryScheduleController {
  static async create(options) {
    await create(options).catch(e => {
      process.stderr.write(`${e.message}\n`)
      process.exitCode = 1;
    })
  }
}

async function create(options) {
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
  await c.quit()

  if(response.isSuccess) {
    process.stdout.write(`${response.statusText}\n`)
  } else {
    throw new Error(response.statusText);
  }
}