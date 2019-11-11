const program = require('commander');

program
.action(_ => console.log('supplier-export'))
.parse(process.argv)