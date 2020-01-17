const FmClient = require('../../../../src/fm-client/FmClient');
const Points = require('../../../../src/fm-client/abilities/for-shop/customers/Points');

const MEMBERSHIP_NUMBER = process.env.MEMBERSHIP_NUMBER
const user = {
  FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
  FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
  FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
  FMWW_PASSWORD          : process.env.FMWW_PASSWORD
}

describe('Points', function () {
  const c = new FmClient()

  before(async function() {
    const ability = await c
      .open(process.env.FMWW_SIGN_IN_URL)
      .signIn(user)
      .createAbility(Points)
    expect(ability).to.be.an.instanceof(Points);
  }) 
  
  after(async function() {
    await c.quit()
  })

  it('create', async function () {
    const response = await c.create({
      membershipNumber: MEMBERSHIP_NUMBER,
      storeCode: '001',
      owner: '9900',
      points: '1',
      grounds: '04'
    })
    expect(response.isSuccess).be.true
  });

  it('search', async function () {
    const response = await c.search()
    expect(response).to.have.lengthOf(0)
  });

  it('update', async function () {
    const response = await c.update()
    expect(response).be.true
  });
})