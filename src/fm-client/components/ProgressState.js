module.exports = class ProgressState {
  constructor(op) {
    this.statusText_ = op.statusText || ''
    this.percentage_ = op.percentage || 0
  }

  get statusText() {
    return this.statusText_
  }
  get percentage() {
    return this.percentage_
  }
}