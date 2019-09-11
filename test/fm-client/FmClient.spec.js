const { expect } = require('chai');
const FmClient = require('../../src/fm-client/FmClient');
const Nop = require('../../src/fm-client/abilities/Nop')
const ProductMaintenance = require('../../src/fm-client/abilities/external-interface/ProductMaintenance')

describe('FmClient', function () {
  let client = null
  const user = {
    FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
    FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
    FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
    FMWW_PASSWORD          : process.env.FMWW_PASSWORD
  }
  const jan = '0000001002478'

  before(async function() {
    client = new FmClient();
  }) 
  
  after(async function() {
    await client.quit()
    client = null
  }) 

  it('open', async function () {
    const response = await client.open(process.env.FMWW_SIGN_IN_URL)
    expect(response.status()).to.equal(200);
    expect(response.statusText().toUpperCase()).to.equal('OK')
  });

  it('signIn', async function () {
    const response = await client.signIn(user)
    expect(response).be.true
  });

  it('createAbility', async function () {
    const ability = await client.createAbility()
    expect(ability).to.be.an.instanceof(Nop);
  });

  it('search', async function () {
    const goods = await client.search({jan: jan})
    expect(goods.jan).to.equal(jan)
  });

  it('method chain', async function () {
    const c = new FmClient()
    const goods = await c
      .open(process.env.FMWW_SIGN_IN_URL)
      .signIn(user)
      .createAbility()
      .search({jan: jan})
    expect(goods.jan).to.equal(jan);
    await c.quit()
  });

  it('ProductMaintenance', async function () {
    const ability = await client
      .open(process.env.FMWW_SIGN_IN_URL)
      .signIn(user)
      .createAbility({path: ProductMaintenance.path})
    expect(ability).to.be.an.instanceof(ProductMaintenance);
    
    const goods = await client.search({
      saveTo: process.cwd(),
      barcode: jan,
      prefix: '0'.repeat(4)
    })
    expect(goods.jan).to.equal(jan);
  });

});