const { expect } = require('chai');
const _ = require('lodash');
const globalVariables = _.pick(global, ['expect']);

// expose variables
before (function () {
  global.expect = expect;
});

// reset global variables
after (function () {
  global.expect = globalVariables.expect;
});