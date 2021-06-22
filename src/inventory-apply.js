const program = require('commander');
const { commaSeparatedList } = require('./util');
const InventoryScheduleController = require('./fm-client/controllers/inventory/issuance/InventoryScheduleController')

program
.option('-z, --zero-fill', '実棚にないSKU在庫数量を0にする')
.option('-d, --stocktaking-date <date>', '棚卸日')
.option('-s, --store-codes <codes>', '「,」区切りの店舗コード', commaSeparatedList)
.action(InventoryScheduleController.create)
.parse(process.argv)