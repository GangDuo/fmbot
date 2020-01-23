const program = require('commander');
const InventoryController = require('./fm-client/controllers/inventory/issuance/InventoryController')

program
.action(InventoryController.create)
.parse(process.argv)