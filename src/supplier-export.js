const program = require('commander');
const SupplierController = require('./fm-client/controllers/master/others/SupplierController')

program
.option('-o, --output <file>', '標準出力ではなく<file>に出力を書き込みます。')
.action(SupplierController.export)
.parse(process.argv)