const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const ApplicationView = require('../views/ApplicationView');
const EventEmitter = require('events').EventEmitter;
const {FmClient, ProductMaintenance} = require('fmww-library');
const os = require('os');
const path = require('path');
const moment = require('moment');
const ProgressState = require('../components/ProgressState');

const mkdirAsync = promisify(fs.mkdir);

function red(s) {
  return '\u001b[31m' + s + '\u001b[0m'
}

module.exports = class ApplicationController {
  static async onStart(others, options) {
    const prefix = '.fmbot_'
    const workDir = options.tempDir || path.join(os.tmpdir(), prefix + moment().format('YYYYMMDD_HHmmss'))
    if(options.tempDir.length === 0) {
      await mkdirAsync(workDir)
      process.stderr.write('\u001b[47m' + red('コマンドライン引数で保存先を指定しなかったので、一時保存ディレクトリを作成しました。\n' + workDir + '\n') + '\u001b[0m')
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
      view.progressBar.performStep()
      view.label = view.progressBar.value === view.progressBar.maximum ? '' : buildLabel(view.progressBar.value, view.progressBar.maximum, state.statusText)
      view.render()  
    })
    view.label = 'ログインしています。'
    view.progressBar.step = 1
    view.render()
    await downloader.download(workDir, janCodeList)
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