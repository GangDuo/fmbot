const chai = require('chai');
const Browser = require('../../../src/fm-client/components/Browser')

describe("Browser", function() {
  before(function() {})
  
  after(function() {})

  it("launch then close:", async function() {
    const browser = new Browser()
    await browser.launch()
    expect(await browser.raw.version()).to.be.a('string')

    await browser.newPage()
    const page = browser.page
    await page.goto(process.env.FMWW_SIGN_IN_URL)

    await page.close()
    await browser.close()
    chai.assert.isOk(true)
  });
});