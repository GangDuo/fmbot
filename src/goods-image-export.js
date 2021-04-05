const program = require('commander');
const GoodsImageController =require('./fm-client/controllers/master/goods/goods-image/');

program
  .arguments('[others...]')
  .option('-d, --destination <path>', '商品画像をダウンロードするディレクトリ', '')
  .action(GoodsImageController.export)
  .parse(process.argv)