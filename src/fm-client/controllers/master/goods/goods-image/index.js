const readline = require('readline');
var fs = require('fs');

module.exports = class GoodsImageController {
  static async export(others, options) {
    console.log("goods-image-export");
    if (others.length > 0) {
      // ファイルドロップ
      const result = await GoodsImageController.handleDragDrop_(others).catch(e => e)
      console.log(result)      
    } else {
      // 標準入力
      readline.createInterface({
        input: process.stdin
      })
      .on('line', GoodsImageController.handleReadLine_)
      .on('close', () => {
        console.log("END!");
      });      
    }
  }

  static handleReadLine_(line) {
    if(line.length === 0) return
    console.log(`model number is %s`, line)
  }

  static handleDragDrop_ = (array) => new Promise((resolve, reject) => {
    const next = (xs) => {
      const x = xs.shift();
      if(x) {
        try {
          // do something
          console.log(x)
          readline.createInterface({
            input: fs.createReadStream(x)
          })
          .on('line', GoodsImageController.handleReadLine_)
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
};