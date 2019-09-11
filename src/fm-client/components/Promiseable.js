const ActionHandler = require('./ActionHandler')
const debug = require('../../diagnostics/debug')

module.exports = class Promiseable {
  constructor(queue) {
    if(!queue.enqueue) {throw new Error('require enqueue method')}
    if(!queue.dequeue) {throw new Error('require dequeue method')}

    this.queue = queue
  }

  enqueue(func, argsArray) {
    this.queue.enqueue(new ActionHandler(this, func, argsArray))
  }

  dequeue() {
    return this.queue.dequeue()
  }

  catch(reject) {
    //this._rejectActivePromise = reject
    return this.then(undefined, reject)
  }

  then(fulfill, reject) {
    debug.log('WebBrowser outer then')
    return new Promise((success, failure) => {
      debug.log('WebBrowser inner then')
      this.run((err, result) => {
        debug.log('callback ->>>>')
        debug.log(result)
        if (err) failure(err)
        else success(result)
      })
    }).then(fulfill, reject)
  }

  run(callback) {
    const self = this
    const func = callback || function() {}
    debug.log('run')

    setImmediate(async function work() {
      let err = null
      let result = null
      debug.log('work queue: ' + self.queue.count)

      if(self.queue.count > 0) {
        const x = self.dequeue()
        debug.log(x.entity.toString())
        result = await x.entity.apply(x.context, x.args)
        debug.log('result ->>>>>>')
        debug.log(result)
      }
      if(self.queue.count === 0) {
        func(err, result)
        debug.log('is completed')
      } else {
        setImmediate(work)
      }
    })
  }
}