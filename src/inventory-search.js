const program = require('commander');
const InventoryController = require('./fm-client/controllers/inventory/issuance/InventoryController')

program
.action(InventoryController.search)
.parse(process.argv)