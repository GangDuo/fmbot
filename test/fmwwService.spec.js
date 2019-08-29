const assert = require('assert');
const chai = require('chai');
const fmww = require('../fmwwService')

describe("fmwwService", function() {
  let page = null

  before(async function() { 
    page = await fmww.newPage(browser)
    await page.goto(process.env.FMWW_SIGN_IN_URL)
  }) 
  
  after(async function() {
    await page.close();
  }) 
    
  it("signIn:", async function() {
    await fmww.signIn(page)
    chai.assert.isOk(true)
  });
});