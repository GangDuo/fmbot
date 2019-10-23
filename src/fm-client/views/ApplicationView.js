const ProgressBar = require('./ProgressBar')

function moveCursorUpOneLine() {
  process.stdout.write("\033[1A\r")
}

module.exports = class ApplicationView {
  constructor() {
    this.progressBar_ = new ProgressBar
    this.label = ''
  }

  get progressBar() {
    return this.progressBar_
  }

  get label() {
    return this.label_
  }

  set label(val) {
    this.label_ = val
  }

  render() {
    const width = 50
    const msg = this.label
    const formatedMsg = (width - msg.length) > 0 ? msg + ' '.repeat(width - msg.length) : msg.substr(0, width)
    process.stdout.write('\r' + formatedMsg + '\n')
    this.progressBar.render()
    moveCursorUpOneLine()
  }
}