const moment = require('moment');
const program = require('commander');
const { commaSeparatedList } = require('./util');
const PromotionController = require('./fm-client/controllers/for-shop/customers/PromotionController')

program
.option('-b, --begin-date <date>', '設定日付 自', moment().format('YYYY-MM-DD'))
.option('-e, --end-date <date>', '設定日付 至', moment().format('YYYY-MM-DD'))
.option('-n, --rate <value>', '倍率', 10)
.option('-s, --store-codes <codes>', '「,」区切りの店舗コード', commaSeparatedList)
.action(PromotionController.create)
.parse(process.argv)