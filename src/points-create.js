const program = require('commander');
const PointsController = require('./fm-client/controllers/for-shop/customers/PointsController')

program
.option('-m, --membership-number <number>', '会員番号')
.option('-s, --store-code <code>', 'ポイント発行店舗コード')
.option('-o, --owner <code>', '入力担当者コード', 9900)
.option('-p, --points <value>', '発行ポイント')
.action(PointsController.create)
.parse(process.argv)