const { FmClient, PurchasingAsBatch } = require('fmww-library');

module.exports = class PurchasingController {
  static async import(options) {
    await import_(options).catch(e => {
      process.stderr.write(`${e.message}\n`)
      process.exitCode = 1;
    })
  }
};

async function import_(options) {
  const client = new FmClient()
  const response = await client
    .open(process.env.FMWW_SIGN_IN_URL)
    .signIn({
      FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
      FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
      FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
      FMWW_PASSWORD          : process.env.FMWW_PASSWORD
    })
    .createAbility(PurchasingAsBatch)
    .create({
      filePath: options.filename
    })
  await client.quit()

  if(response) {
    if(response.isSuccess) {
      process.stdout.write(`${response.statusText}\n`)
    } else {
      throw new Error(response.statusText);
    }
  } else {
    throw new Error("予期せぬエラー");
  }
}