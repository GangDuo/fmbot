const Queue = require('../collections/Queue')
const Promiseable = require('./components/Promiseable')
const Nop = require('./abilities/Nop')
const ProductMaintenance = require('./abilities/external-interface/ProductMaintenance')
const fmww = require('../../fmwwService')
const debug = require('../diagnostics/debug')
const Supplier = require('./abilities/master/Supplier')

module.exports = class FmClient extends Promiseable {
  constructor() {
    super(new Queue)

    // initialize
    this.responses = new Queue

    this.enqueue(async () => {
      this.browser = await fmww.createBrowserInstance()
      this.page = await fmww.newPage(this.browser)

      // 各リクエストのレスポンスを検知
      this.page.on('response', response => {
        this.responses.enqueue(response)
        debug.log(response.status(), response.url()) // 全リクエストのステータスコードとURLをlog
        if (300 > response.status() && 200 <= response.status()) return;
        debug.warn('status error', response.status(), response.url()) // ステータスコード200番台以外をlog
      });
    })
  }

  open(url) {
    this.enqueue(async () => {
      this.responses.clear()
      await Promise.all([
        this.page.waitForNavigation({waitUntil: 'networkidle2'}),
        this.page.goto(url)
      ])
      return this.responses.dequeue()
    }, [url])
    return this
  }

  quit() {
    this.enqueue(async () => {
      await this.browser.close()
    })
    return this
  }

  signIn(user) {
    this.enqueue(async () => {
      await fmww.signIn(this.page, user)
      return true
    }, [user])
    return this
  }

  createAbility(abilityClass) {
    const AbilityClass = abilityClass || Nop

    this.enqueue(async () => {
      this.ability = new AbilityClass(this.page)
      await this.ability.enable()
      return this.ability
    })
    return this
  }

  search(op) {
    debug.log('FmClient.search')
    this.enqueue(async () => {
      return await this.ability.search(op)
    })
    return this
  }

  create(op) {
    debug.log('FmClient.create')
    this.enqueue(async () => {
      return await this.ability.create(op)
    })
    return this
  }

  update(op) {
    debug.log('FmClient.update')
    this.enqueue(async () => {
      return await this.ability.update(op)
    })
    return this
  }

  delete(op) {
    debug.log('FmClient.delete')
    this.enqueue(async () => {
      return await this.ability.delete(op)
    })
    return this
  }
}