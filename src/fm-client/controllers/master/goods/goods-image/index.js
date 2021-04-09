const readline = require('readline');
var fs = require('fs');
const ora = require('ora');

const Downloader = require('./Downloader');

module.exports = class GoodsImageController {
  static async export(others, options) {
    console.log("goods-image-export");
    const downloader = new Downloader()
    // for view
    const spinner = ora('ログイン中').start();
    downloader.on('Ready', () => {spinner.text = 'Ready'})
    downloader.on('Quit', ({hasError}) => {
      spinner.text = 'Quit'
      if(hasError) spinner.fail()
      else spinner.succeed()
    })
    downloader.on('StartDownloading', ({modelNumber}) => {
      spinner.text = `model number is ${modelNumber}`
    })
    downloader.on('Downloaded', ({modelNumber}) => {
      spinner.text = `Downloaded ${modelNumber}`
    })
    downloader.on('Exception', (e) => {
      spinner.color = 'red';
      spinner.text = e
    })

    const instance = new GoodsImageController(downloader)
    await instance.downloader.setUp()

    if (others.length > 0) {
      // ファイルドロップ
      await instance.handleDragDrop_(others).catch(e => e)
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
            //console.log(x)
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