const program = require('commander');

program
  .version('0.0.1')
  .command('search [query]', '取引先情報を取得します。', {isDefault: true})
  .command('create [query]', '取引先を新規作成します。')
  .command('update [query]', '取引先を更新します。')
  .command('delete [query]', '取引先を削除します。')
  .command('export [query]', 'CSV形式で取引先マスタをエクスポートします。')
  .parse(process.argv);