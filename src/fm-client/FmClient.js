const Queue = require('../collections/Queue')
const Promiseable = require('./Promiseable')
const Nop = require('./Nop')

module.exports = class FmClient extends Promiseable {
  constructor() {
    super(new Queue)
  }

  open(url) {
    this.enqueue(async () => {
      return new Promise(function(success, failure) {
        console.log('_open')
        setTimeout(() => success({status:{code: 200, text: 'OK'}}), 1000)
      })
    }, [url])
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