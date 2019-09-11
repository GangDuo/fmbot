module.exports = class ActionHandler {
  constructor(thisArg, func, argsArray) {
    this.context_ = thisArg
    this.entity_ = func
    this.args_ = argsArray
  }

  get context() { return this.context_ }
  get entity() { return this.entity_ }
  get args() { return this.args_ }
}
