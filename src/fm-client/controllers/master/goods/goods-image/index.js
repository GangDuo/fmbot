const readline = require('readline');

module.exports = class GoodsImageController {
  static export(others, options) {
    console.log("goods-image-export");
    if (others.length > 0) {
      // ファイルドロップ
    } else {
      // 標準入力
      readline.createInterface({
        input: process.stdin
      })
      .on('line', (line) => {
        console.log(`model number is %s`, line)
      })
      .on('close', () => {
        console.log("END!");
      });      
    }
  }
};