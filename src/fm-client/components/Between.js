module.exports = class Between {
  constructor(from, to) {
    this.from_ = from
    this.to_ = to
  }
  get from() { return this.from_ }
  get to() { return this.to_ }
}