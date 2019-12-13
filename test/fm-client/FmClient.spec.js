const { expect } = require('chai');
const FmClient = require('../../src/fm-client/FmClient');
const Nop = require('../../src/fm-client/abilities/Nop')
const ProductMaintenance = require('../../src/fm-client/abilities/external-interface/ProductMaintenance')
const Supplier = require('../../src/fm-client/abilities/master/Supplier')
const MovementExport = require('../../src/fm-client/abilities/movement/MovementExport')
const Promotion = require('../../src/fm-client/abilities/for-shop/customers/Promotion')
const Between = require('../../src/fm-client/components/Between')

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
      .createAbility(ProductMaintenance)
    expect(ability).to.be.an.instanceof(ProductMaintenance);
    
    const goods = await client.search({
      saveTo: process.cwd(),
      barcode: jan,
      prefix: '0'.repeat(4)
    })
    expect(goods.jan).to.equal(jan);
  });

  describe('MovementExport', function () {
    const c = new FmClient()

    before(async function() {
      const ability = await c
        .open(process.env.FMWW_SIGN_IN_URL)
        .signIn(user)
        .createAbility(MovementExport)
      expect(ability).to.be.an.instanceof(MovementExport);  
    }) 
    
    after(async function() {
      await c.quit()
    }) 

    it('search', async function () {
      const res = await c.search()
      expect(res).to.have.lengthOf(1)
    });

    it('create', async function () {
      const response = await c.create()
      expect(response).be.true
    });

    it('update', async function () {
      const response = await c.update()
      expect(response).be.true
    });

    it('delete', async function () {
      const response = await c.delete()
      expect(response).be.true
    });

    it('export', async function () {
      const response = await c.export({
        filename: 'movement.csv'
      })
      expect(response).be.true
    });
  });

  describe('Promotion', function () {
    const c = new FmClient()

    before(async function() {
      const ability = await c
        .open(process.env.FMWW_SIGN_IN_URL)
        .signIn(user)
        .createAbility(Promotion)
      expect(ability).to.be.an.instanceof(Promotion);  
    }) 
    
    after(async function() {
      await c.quit()
    }) 

    it('search', async function () {
      const pairs = [
        [3, new Between('2019-10-01', '2019-10-10')],
        [0, new Between('2019-09-30', '2019-09-30')]
      ]
      for(let pair of pairs) {
        const response = await c.search(pair[1])
        expect(response).to.have.lengthOf(pair[0])
      }
    });
    it('create', async function () {
      const response = await c.create({
        between: new Between('1970-01-01', '1970-01-03'),
        rate: 10,
        targets: ['001', '009', '016']
      })
      expect(response).be.true
    });
    it('update', async function () {
      const response = await c.update()
      expect(response).be.true
    });
    it('delete', async function () {
      const response = await c.delete()
      expect(response).be.true
    });
  })

  describe('Supplier', function () {
    const c = new FmClient()

    before(async function() {
      const ability = await c
        .open(process.env.FMWW_SIGN_IN_URL)
        .signIn(user)
        .createAbility(Supplier)
      expect(ability).to.be.an.instanceof(Supplier);  
    }) 
    
    after(async function() {
      await c.quit()
    }) 

    it('update', async function () {
      const res = await c.update({
        id: '9999A',
        supplierName: 'ﾃｽﾄ（株）'
      })
      expect(res.message).to.equal('仕入先を更新しました');
    });

    it('export', async function () {
      const response = await c.export({
        filename: 'supplier.csv'
      })
      expect(response).be.true
    });
  })

});