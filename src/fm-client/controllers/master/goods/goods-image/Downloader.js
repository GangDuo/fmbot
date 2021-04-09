const EventEmitter = require('events').EventEmitter;
const {FmClient, GoodsImage} = require('fmww-library');

module.exports = class Downloader extends EventEmitter {
  constructor() {
    super()
    this.fmClient = new FmClient()
  }

  async setUp() {
    await this.fmClient.open(process.env.FMWW_SIGN_IN_URL)
      .signIn({
        FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
        FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
        FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
        FMWW_PASSWORD          : process.env.FMWW_PASSWORD
      })
      .createAbility(GoodsImage)
    this.emit('Ready')
  }

  async tearDown() {
    await this.fmClient.quit()
    this.emit('Quit')
  }

  async download(options) {
    // 1つのFmClientインスタンスを再利用する
    // FmClientはブラウザインスタンスを生成するため、
    // 大量の画像をダウンロードする時に
    // ここでnew FmClientすると画像枚数分のブラウザインスタンスを生成しようとして
    // リソース上限に達し失敗する
    this.emit('StartDownloading', options)
    await this.fmClient.export(options).catch(e => this.emit('Exception', e))
    this.emit('Downloaded', options)
  }

  async downloadImagesBy(rl) {
    for await (const line of rl) {
      if(line.length === 0) continue;
  
      await this.download({
        baseURL: process.env.FMWW_SIGN_IN_URL,
        modelNumber: line
      })
    }
  }
}