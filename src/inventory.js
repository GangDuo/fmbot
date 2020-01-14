const program = require('commander');

program
  .version('0.0.1')
  .command('search [query]', '棚卸入力 -> 照会', {isDefault: true})
  .command('create [query]', '棚卸入力 -> 入力')
  .command('apply [query]', '棚卸更新 -> 実行')
  .parse(process.argv);
