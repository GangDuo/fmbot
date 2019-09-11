class Debug {
  constructor() {
    const DEBUG = process.env.DEBUG || ''
    this.isDebug = (DEBUG.toLowerCase() === 'true')
  }

  enable() {
    this.isDebug = true
  }

  disable() {
    this.isDebug = false
  }

  log() {
    const log = console.log
    if(this.isDebug) {
      log.apply(log, arguments)
    }
  }

  warn() {
    const log = console.warn
    if(this.isDebug) {
      log.apply(log, arguments)
    }
  }
}

module.exports = new Debug()