const os = require('os');
const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');
const {FmClient, Supplier} = require('fmww-library');

module.exports = class SupplierController {
  static search(options) {
    console.log('supplier-search')
  }

  static create(options) {
    console.log('supplier-create')
  }

  static update(options) {
    console.log('supplier-update')
  }

  static delete(options) {
    console.log('supplier-delete')
  }
  
  static async export(options) {
    const DEFAULT_NAME = path.join(os.tmpdir(), '.supplier.fmbot')

    await new FmClient()
      .open(process.env.FMWW_SIGN_IN_URL)
      .signIn({
        FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
        FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
        FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
        FMWW_PASSWORD          : process.env.FMWW_PASSWORD
      })
      .createAbility(Supplier)
      .export({
        filename: options.output || DEFAULT_NAME
      })
      .quit()

    if(!options.output) {
      fs.createReadStream(DEFAULT_NAME)
      .pipe(iconv.decodeStream('SJIS'))
      .pipe(iconv.encodeStream('UTF-8'))
      .pipe(process.stdout)
    }
  }
}