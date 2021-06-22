const program = require('commander');

program
  .version('0.0.1')
  .command('export [query]', 'CSV形式で移動データをエクスポートします。', {isDefault: true})
  .command('import [query]', 'CSV形式で移動データを新規作成します。')
  .parse(process.argv);