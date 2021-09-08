const program = require('commander');

program
  .version('0.0.1')
  .command('import [query]', 'CSV形式で仕入データを新規作成します。', {isDefault: true})
  .parse(process.argv);
