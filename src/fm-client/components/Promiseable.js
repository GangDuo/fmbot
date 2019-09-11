const ActionHandler = require('./ActionHandler')

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
    console.log('WebBrowser outer then')
    return new Promise((success, failure) => {
      console.log('WebBrowser inner then')
      this.run((err, result) => {
        console.log('callback ->>>>')
        console.log(result)
        if (err) failure(err)
        else success(result)
      })
    }).then(fulfill, reject)
  }

  run(callback) {
    const self = this
    const func = callback || function() {}
    console.log('run')

    setImmediate(async function work() {
      let err = null
      let result = null
      console.log('work queue: ' + self.queue.count)

      if(self.queue.count > 0) {
        const x = self.dequeue()
        console.log(x.entity.toString())
        result = await x.entity.apply(x.context, x.args)
        console.log('result ->>>>>>')
        console.log(result)
      }
      if(self.queue.count === 0) {
        func(err, result)
        console.log('is completed')
      } else {
        setImmediate(work)
      }
    })
  }
}