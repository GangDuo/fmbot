const readline = require('readline');
var fs = require('fs');

const Downloader = require('./Downloader');

module.exports = class GoodsImageController {
  static async export(others, options) {
    console.log("goods-image-export");
    const downloader = new Downloader()
    // for view
    downloader.on('Ready', () => {console.log('Ready')})
    downloader.on('Quit', () => {console.log('Quit')})
    downloader.on('StartDownloading', ({modelNumber}) => {console.log(`model number is %s`, modelNumber)})
    downloader.on('Downloaded', ({modelNumber}) => {console.log('Downloaded %s', modelNumber)})
    downloader.on('Exception', (e) => {console.error(e)})

    const instance = new GoodsImageController(downloader)
    await instance.downloader.setUp()

    if (others.length > 0) {
      // ファイルドロップ
      const result = await instance.handleDragDrop_(others).catch(e => e)
      console.log(result)      
    } else {
      // 標準入力
      const rl = readline.createInterface({
        input: process.stdin
      })
      await instance.downloader.downloadImagesBy(rl)
    }
    await instance.downloader.tearDown()
  }

  constructor(downloader) {
    this.downloader = downloader
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
            await this.downloader.downloadImagesBy(rl)
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