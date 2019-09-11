const Queue = require('../collections/Queue')
const Promiseable = require('./components/Promiseable')
const Nop = require('./abilities/Nop')
const ProductMaintenance = require('./abilities/external-interface/ProductMaintenance')
const fmww = require('../../fmwwService')

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
        console.log(response.status(), response.url()) // 全リクエストのステータスコードとURLをlog
        if (300 > response.status() && 200 <= response.status()) return;
        console.warn('status error', response.status(), response.url()) // ステータスコード200番台以外をlog
      });
    })
  }

  open(url) {
    this.enqueue(async () => {
      this.responses.clear()
      await this.page.goto(url)
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

  createAbility(options = {}) {
    const path = options.path || 0
    switch(path) {
      case ProductMaintenance.path: {
        this.ability = new ProductMaintenance(this.page)
        break;
      }

      default: {
        this.ability = new Nop()
        break;
      }
    }

    this.enqueue(async () => {
      await this.ability.enable()
      return this.ability
    })
    return this
  }

  search(op) {
    console.log('FmClient.search')
    this.enqueue(async () => {
      return await this.ability.search(op)
    })
    return this
  }

  create() {
    console.log('FmClient.create')
    return this
  }

  update() {
    console.log('FmClient.update')
    return this
  }

  delete() {
    console.log('FmClient.delete')
    return this
  }
}