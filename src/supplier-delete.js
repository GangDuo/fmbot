const program = require('commander');

program
.action(_ => console.log('supplier-delete'))
.parse(process.argv)