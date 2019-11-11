const program = require('commander');

program
.action(_ => console.log('supplier-create'))
.parse(process.argv)