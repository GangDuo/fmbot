const program = require('commander');
const PurchasingController = require('./fm-client/controllers/purchasing');

program
  .option('-f, --filename <path>', 'CSVファイルのパス。')
  .action(PurchasingController.import)
  .parse(process.argv)