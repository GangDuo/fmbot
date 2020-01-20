const program = require('commander');

program
  .version('0.0.1')
  .command('search [query]', 'ポイント入力 -> 照会', {isDefault: true})
  .command('create [query]', 'ポイント入力 -> 入力')
  .parse(process.argv);
