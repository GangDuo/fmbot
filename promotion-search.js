const program = require('commander');
const PromotionController = require('./src/fm-client/controllers/for-shop/customers/PromotionController')

program
.option('-b, --begin-date <date>', '設定日付 自', '今日')
.option('-e, --end-date <date>', '設定日付 至', '今日')
.option('-n, --setting-number <value>', '設定番号', '')
.action(PromotionController.onStart)
.parse(process.argv)