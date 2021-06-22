const moment = require('moment');
const program = require('commander');
const { commaSeparatedList } = require('./util');
const MovementController = require('./fm-client/controllers/movement');

program
  .option('-o, --output <file>', '標準出力ではなく<file>に出力を書き込みます。')
  .option('-b, --begin-date <date>', '移動日付 自', moment().format('YYYY-MM-DD'))
  .option('-e, --end-date <date>', '移動日付 至', moment().format('YYYY-MM-DD'))
  .option('-s, --sender-store-codes <codes>', '「,」区切りの店舗コード', commaSeparatedList)
  .option('-r, --receiver-store-codes <codes>', '「,」区切りの店舗コード', commaSeparatedList)
  .action(MovementController.export)
  .parse(process.argv)