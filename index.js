const puppeteer = require('puppeteer');
const {promisify} = require('util');
const fs = require('fs');
const widget = require('./widget');
const fmww = require('./fmwwService')
const FmClient = require('./src/fm-client/FmClient');
const ProductMaintenance = require('./src/fm-client/abilities/external-interface/ProductMaintenance')

const readFileAsync = promisify(fs.readFile);

function red(s) {
  return '\u001b[31m' + s + '\u001b[0m'
}

(async () => {
  // コマンドライン引数
  for (let i = 0; i < process.argv.length; i++) {
    console.log("argv[" + i + "] = " + process.argv[i]);
  }

  if(process.argv.length < 3) {
    process.stderr.write('\u001b[47m' + red('コマンドライン引数不足。保存ディレクトリを指定してください。') + '\u001b[0m')
    return
  }

  // 商品マスタをダウンロードする一時ディレクトリ
  const temp = process.argv[2]

  // 指定したjanのみを抽出する場合
  const janCodeList = await (async (file) => {
    const buf = await readFileAsync(file)
    return buf.toString().split(/\r\n/).filter(a => a.length > 0)
  })(process.argv[3]).catch(_ => [])
  console.log(janCodeList)

  const client = new FmClient()
  const ability = await client.open(process.env.FMWW_SIGN_IN_URL)
    .signIn({
      FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
      FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
      FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
      FMWW_PASSWORD          : process.env.FMWW_PASSWORD
    }).createAbility(ProductMaintenance)

  const xs = janCodeList.length > 0 ? janCodeList : ability.items
  const width = 30
  for (let i = 0; i < xs.length; i++) {
    const msg = '[' + (i+1) + '/' + xs.length + ']: ' + xs[i]
    const formatedMsg = (width - msg.length) > 0 ? msg + ' '.repeat(width - msg.length) : msg.substr(0, width)
    process.stdout.write('\r' + formatedMsg + '\n')
    widget.progress(xs.length, i)

    let options = {saveTo: temp}
    if(janCodeList.length > 0) {
      options.barcode = xs[i]
      options.prefix = ('0'.repeat(7) + (i + 1)).substr(-8)
    } else {
      options.itemCode = xs[i][0]
    }
    await client.search(options)

    widget.progress(xs.length, (i+1))
    process.stdout.write("\033[1A")
  };

  await client.quit();
})();
