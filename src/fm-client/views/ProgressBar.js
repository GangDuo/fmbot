const widget = require('./widget');

module.exports = class ProgressBar {
  constructor() {
    this.maximum = 100
    this.minimum = 0
    this.step = 10
    this.text = ''
    this.value = 0
  }

  get maximum() {
    return this.maximum_
  }

  set maximum(val) {
    this.maximum_ = val
  }

  get minimum() {
    return this.minimum_
  }

  set minimum(val) {
    this.minimum_ = val
  }

  get step() {
    return this.step_
  }

  set step(val) {
    this.step_ = val
  }

  get text() {
    return this.text_
  }

  set text(val) {
    this.text_ = val
  }

  get value() {
    return this.value_
  }

  set value(val) {
    this.value_ = val
  }

  increment (integer) {
    if(this.value >= this.maximum) return
    this.value += integer
    if(this.value > this.maximum) {
      this.value = this.maximum
    }
  }

  performStep() {
    this.increment(this.step)
  }

  render() {
    widget.progress(this.maximum, this.value)
  }
}