const readline = require('readline');
var fs = require('fs');
const {FmClient, GoodsImage} = require('fmww-library');

module.exports = class GoodsImageController {
  static async export(others, options) {
    console.log("goods-image-export");
    const instance = new GoodsImageController()
    await instance.setUp()

    if (others.length > 0) {
      // ファイルドロップ
      const result = await instance.handleDragDrop_(others).catch(e => e)
      console.log(result)      
    } else {
      // 標準入力
      await instance.handleStdin_()
    }
    await instance.tearDown()
  }

  constructor() {
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
  }

  async tearDown() {
    await this.fmClient.quit()
  }

  async handleReadLine_(line) {
    if(line.length === 0) return
    console.log(`model number is %s`, line)

    // 1つのFmClientインスタンスを再利用する
    // FmClientはブラウザインスタンスを生成するため、
    // 大量の画像をダウンロードする時に
    // ここでnew FmClientすると画像枚数分のブラウザインスタンスを生成しようとして
    // リソース上限に達し失敗する
    await this.fmClient.export({
      baseURL: process.env.FMWW_SIGN_IN_URL,
      modelNumber: line
    })

    console.log(`downloaded %s`, line)
  }

  async handleStdin_() {
    const rl = readline.createInterface({
      input: process.stdin
    })

    for await (const line of rl) {
      await this.handleReadLine_(line)
    }
    console.log("END!");
  }

  handleDragDrop_(array) {
    return new Promise(async(resolve, reject) => {
      const next = async (xs) => {
        const x = xs.shift();
        if(x) {
          try {
            // do something
            console.log(x)
            const rl = readline.createInterface({
              input: fs.createReadStream(x)
            })
            for await (const line of rl) {
              await this.handleReadLine_(line)
            }
            console.log("END!");
            await next(xs)
          } catch (error) {
            reject(error)
          }
        } else {
          resolve({status: "OK"})
        }
      }
      
      await next(array)
    })
  }
};