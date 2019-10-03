const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const ApplicationView = require('../views/ApplicationView');
const EventEmitter = require('events').EventEmitter;
const FmClient = require('../FmClient');
const ProductMaintenance = require('../abilities/external-interface/ProductMaintenance')

function red(s) {
  return '\u001b[31m' + s + '\u001b[0m'
}

module.exports = class ApplicationController {
  static async onStart(others, options) {
    if(options.tempDir.length === 0){
      process.stderr.write('\u001b[47m' + red('コマンドライン引数不足。保存ディレクトリを指定してください。') + '\u001b[0m')
      return
    }
  
    // 指定したjanのみを抽出する場合
    const janCodeList = await (async (files) => {
      let xs = []
      for (let i = 0; i < files.length; i++) {
        const path = files[i];
        xs = xs.concat(await (async (file) => {
          const buf = await readFileAsync(file)
          return buf.toString().split(/\r\n/).filter(a => a.length > 0)
        })(path).catch(_ => []))
      }
      return xs
    })(others)
    console.log(janCodeList)
  
    const buildLabel = (value, maximum, text) => {
      return `[${value}/${maximum}]: ${text}`
    }
    const view = new ApplicationView()
    const downloader = new Downloader()
    // bind
    downloader.on('Before', context => {
      view.progressBar.maximum = context.maximum
      view.render()
    })
    .on('BeforeEach' , context => {
      view.label = buildLabel(view.progressBar.value, view.progressBar.maximum, context)
      view.render()
    })
    .on('ProgressChanged', state => {
      view.progressBar.value = state.percentage
      view.label = view.progressBar.value === view.progressBar.maximum ? '' : buildLabel(view.progressBar.value, view.progressBar.maximum, state.statusText)
      view.render()  
    })
    view.label = 'ログインしています。'
    view.render()
    await downloader.download(options.tempDir, janCodeList)  
  }
}

class ProgressState {
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

class Downloader extends EventEmitter {
  constructor() {
    super()
  }

  async download(temp, janCodeList) {
    const client = new FmClient()
    const ability = await client.open(process.env.FMWW_SIGN_IN_URL)
      .signIn({
        FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
        FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
        FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
        FMWW_PASSWORD          : process.env.FMWW_PASSWORD
      }).createAbility(ProductMaintenance)

    const xs = janCodeList.length > 0 ? janCodeList : ability.items
    this.emit('Before', {maximum: xs.length})
    for (let i = 0; i < xs.length; i++) {
      this.emit('BeforeEach', janCodeList.length > 0 ? xs[i] : xs[i][0])
      let options = {saveTo: temp}
      if(janCodeList.length > 0) {
        options.barcode = xs[i]
        options.prefix = ('0'.repeat(7) + (i + 1)).substr(-8)
      } else {
        options.itemCode = xs[i][0]
      }
      await client.search(options)
      this.emit('ProgressChanged', new ProgressState({
        statusText: xs[i],
        percentage: i + 1
      }));
      this.emit('AfterEach')
    };
    this.emit('After')

    await client.quit();
  }
}