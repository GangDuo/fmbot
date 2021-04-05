const program = require('commander');

program
  .version('0.0.1')
  .command('export [query]', '商品画像をローカルディスクに保存します。', {isDefault: true})
  .parse(process.argv);
