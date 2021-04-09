const readline = require('readline');
var fs = require('fs');
const {FmClient, GoodsImage} = require('fmww-library');

module.exports = class GoodsImageController {
  static async export(others, options) {
    console.log("goods-image-export");
    const instance = new GoodsImageController()
    if (others.length > 0) {
      // ファイルドロップ
      const result = await instance.handleDragDrop_(others).catch(e => e)
      console.log(result)      
    } else {
      // 標準入力
      readline.createInterface({
        input: process.stdin
      })
      .on('line', instance.handleReadLine_.bind(instance))
      .on('close', () => {
        console.log("END!");
      });      
    }
  }

  async handleReadLine_(line) {
    if(line.length === 0) return
    console.log(`model number is %s`, line)

    await new FmClient()
      .open(process.env.FMWW_SIGN_IN_URL)
      .signIn({
        FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
        FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
        FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
        FMWW_PASSWORD          : process.env.FMWW_PASSWORD
      })
      .createAbility(GoodsImage)
      .export({
        baseURL: process.env.FMWW_SIGN_IN_URL,
        modelNumber: line
      })
      .quit()
  }

  handleDragDrop_(array) {
    return new Promise((resolve, reject) => {
      const next = (xs) => {
        const x = xs.shift();
        if(x) {
          try {
            // do something
            console.log(x)
            readline.createInterface({
              input: fs.createReadStream(x)
            })
            .on('line', this.handleReadLine_.bind(this))
            .on('close', () => {
              console.log("END!");
              setImmediate(() => {
                next(xs)
              });
            });     
          } catch (error) {
            reject(error)
          }
        } else {
          resolve({status: "OK"})
        }
      }
      
      next(array)
    })
  }
};