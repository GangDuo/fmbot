const { expect } = require('chai');
const Queue = require('../../src/collections/Queue');

describe('Queue', function () {
  const xs = [0, 1]
  let queue = null

  before(async function() {
    queue = new Queue()
  }) 
  
  after(async function() {
    queue = null
  }) 

  it('enqueue', async function () {
    xs.forEach(element => {
      queue.enqueue(element)      
    });
    expect(queue.count).to.equal(xs.length);
  });

  it('peek', async function () {
    expect(queue.peek()).to.equal(xs[0])
    expect(queue.count).to.equal(xs.length);
  });

  it('getEnumerator', async function () {
    let tmp = []
    for(let num of queue.getEnumerator()) {
      tmp.push(num)
    }
    expect(tmp).to.have.ordered.members(xs)
  });

  it('contains', async function () {
    expect(queue.contains(xs[0])).be.true
  });

  it('not contains', async function () {
    expect(queue.contains(-1)).be.false
  });

  it('dequeue', async function () {
    expect(queue.dequeue()).to.equal(xs[0])
    expect(queue.count).to.equal(xs.length - 1);
  });
});