const assert = require('assert');
const chai = require('chai');
const fmww = require('../src/fm-client/core/fmwwService')

describe("fmwwService", function() {
  let browser = null
  let page = null

  before(async function() {
    browser = await fmww.createBrowserInstance()
    expect(await browser.version()).to.be.a('string')

    page = await fmww.newPage(browser)
    await page.goto(process.env.FMWW_SIGN_IN_URL)
  }) 
  
  after(async function() {
    await page.close();
    await browser.close()
  }) 

  it("signIn:", async function() {
    await fmww.signIn(page)
    chai.assert.isOk(true)
  });
});