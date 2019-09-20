const AbstractSinglePage = require('../../components/AbstractSinglePage')
const debug = require('../../../diagnostics/debug')

/*
 * /移動:移動/移動エクスポート/ 
 */
module.exports = class MovementExport extends AbstractSinglePage {
  constructor(page) {
    super(page)
  }

  async enable() {
    debug.log('MovementExport.enable')
  }

  async search(options) {
    debug.log('MovementExport.search')
    return [{
      uuid: 1,
      branchId: 1,
      movedAt: '2019-01-01',
      shipFrom: {code: '002', name: 'Osaka'},
      shipTo: {
        code: '001',
        name: 'Tokyo',
        postalCode: '000-0000',
        prefectures: '',
        address1: '',
        address2: '',
        tel: ''
      },
      goods: [{
        code: '',
        name: '',
        color: {code: '', name: ''},
        size: {code: '', name: ''},
        jan: '',
        price: 0,
        cost: 0,
        qty: 0
      }]
    }]
  }

  create() {
    debug.log('MovementExport.create')
  }

  update() {
    debug.log('MovementExport.update')
  }

  delete() {
    debug.log('MovementExport.delete')
  }
}