const FmClient = require('../../../../src/fm-client/FmClient');
const Schedule = require('../../../../src/fm-client/abilities/inventory/issuance/Schedule');

const user = {
  FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
  FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
  FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
  FMWW_PASSWORD          : process.env.FMWW_PASSWORD
}

describe('Schedule', function () {
  const c = new FmClient()

  before(async function() {
    const ability = await c
      .open(process.env.FMWW_SIGN_IN_URL)
      .signIn(user)
      .createAbility(Schedule)
    expect(ability).to.be.an.instanceof(Schedule);
  }) 
  
  after(async function() {
    await c.quit()
  })

  it('create', async function () {
    const response = await c.create({
      stocktakingDate: '2099-12-31',
      storeCodes: ["99999"],
      zeroFill: false
    })
    expect(response).to.deep.equal({
      isSuccess: false,
      statusText: "更新対象となる伝票が存在しません。"
    });
  });
})