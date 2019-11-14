const program = require('commander');
const SupplierController = require('./fm-client/controllers/master/others/SupplierController')

program
.action(SupplierController.export)
.parse(process.argv)