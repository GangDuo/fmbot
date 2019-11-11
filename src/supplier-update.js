const program = require('commander');

program
.action(_ => console.log('supplier-update'))
.parse(process.argv)