const moment = require('moment');
const program = require('commander');
const PromotionController = require('./fm-client/controllers/for-shop/customers/PromotionController')

program
.option('-b, --begin-date <date>', '設定日付 自', moment().format('YYYY-MM-DD'))
.option('-e, --end-date <date>', '設定日付 至', moment().format('YYYY-MM-DD'))
.option('-n, --setting-number <value>', '設定番号', '')
.option('-O, --output <file>', '出力ファイル名')
.action(PromotionController.search)
.parse(process.argv)