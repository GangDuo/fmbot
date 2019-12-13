const program = require('commander');

program
  .version('0.0.1')
  .command('search [query]', 'ポイント還元イベント情報を取得します。', {isDefault: true})
  .command('create [query]', 'ポイント還元イベントを新規作成します。')
  .parse(process.argv);
