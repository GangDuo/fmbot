const fmww = require('../../core/fmwwService')
const AbstractSinglePage = require('../../components/AbstractSinglePage')
const debug = require('../../../diagnostics/debug')
const MenuItem = require('../../components/MenuItem')

const SEARCH_BUTTON = 2
const MENU_ITEM = new MenuItem(11, 1, 3)

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
    return true
  }

  update() {
    debug.log('MovementExport.update')
    return true
  }

  delete() {
    debug.log('MovementExport.delete')
    return true
  }

  async export(options) {
    debug.log('MovementExport.export')
    await super.clickOnMenu(MENU_ITEM, SEARCH_BUTTON)
    const result = await fmww.exportMovement(this.page, options).catch(_ => false)
    await super.backToMainMenu()
    return result
  }
}