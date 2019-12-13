const program = require('commander');

program
  .version('0.0.1')
  .command('export [query]', 'エクセル形式で商品マスタをエクスポートします。', {isDefault: true})
  .command('import [query]', 'CSV形式で商品マスタを新規作成または更新します。')
  .parse(process.argv);
