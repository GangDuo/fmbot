const {promisify} = require('util');
const fs = require('fs');

const writeFileAsync = promisify(fs.writeFile);

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

exports.writeFileAsync = writeFileAsync
exports.sleep = sleep