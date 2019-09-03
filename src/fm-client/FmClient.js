const Queue = require('../collections/Queue')
const Promiseable = require('./Promiseable')
const Nop = require('./Nop')
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
      return new Promise(function(success, failure) {
        console.log('_signIn')
        setTimeout(() => success(true), 1000)
      })
    }, [user])
    return this
  }

  createAbility(options) {
    return new Nop(this.queue)
    // 呼び出し元でawaitしても、newしているけどnullが返る
    return Promise.resolve(new Nop(this.queue))
    // 下記の形式ならinstanceにnewした結果が格納される
    return Promise.resolve({instance: new Nop(this.queue)})
  }
}