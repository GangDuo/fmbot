const { expect } = require('chai');
const debug1 = require('../../src/diagnostics/debug');
const debug2 = require('../../src/diagnostics/debug');

describe('debug', function () {
  it('singleton', async function () {
    expect(debug1).to.equal(debug2);
  });

});