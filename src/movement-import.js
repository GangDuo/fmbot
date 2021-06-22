const program = require('commander');

program
.action(_ => console.log('movement-import'))
.parse(process.argv)