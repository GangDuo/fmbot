const program = require('commander');

program
.action(_ => console.log('goods-import'))
.parse(process.argv)