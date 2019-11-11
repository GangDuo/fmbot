const program = require('commander');

program
.action(_ => console.log('supplier-search'))
.parse(process.argv)