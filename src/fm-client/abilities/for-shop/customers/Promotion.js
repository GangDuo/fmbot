const debug = require('../../../../diagnostics/debug')
const AbstractSinglePage = require('../../../components/AbstractSinglePage')

/*
 * /店舗管理:店舗顧客/ポイント設定/
 */
module.exports = class Promotion extends AbstractSinglePage {
  constructor(page) {
    super(page)
  }

  enable() {
    debug.log('Promotion.enable')
    return true
  }
}