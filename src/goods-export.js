const program = require('commander');
const ApplicationController =require('./fm-client/controllers/ApplicationController');

// コマンドライン引数
for (let i = 0; i < process.argv.length; i++) {
  console.log("argv[" + i + "] = " + process.argv[i]);
}

program
  .arguments('[others...]')
  .option('-t, --temp-dir <path>', '商品マスタをダウンロードする一時ディレクトリ', '')
  .action(ApplicationController.onStart)
  .parse(process.argv)