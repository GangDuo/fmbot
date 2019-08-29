module.exports = class Queue {
  constructor() {
    this.clear()
  }

  get count() {
    return this.queue.length
  }

  clear() {
    this.queue = [];
  }

  contains(item) {
    return this.queue.includes(item)
  }

  dequeue() {
    if(this.count === 0) {
      throw new Error('Queueが空です。')
    }
    return this.queue.shift()
  }

  enqueue(item) {
    this.queue.push(item)
  }

  peek() {
    if(this.count === 0) {
      throw new Error('Queueが空です。')
    }
    return this.queue[0]
  }

  TryDequeue(result) {
    return this.count > 0
  }

  TryPeek(result) {
    return this.count > 0
  }

  * getEnumerator() {
    yield* this.queue
  }
}
