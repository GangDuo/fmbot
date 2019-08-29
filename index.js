const puppeteer = require('puppeteer');
const {promisify} = require('util');
const fs = require('fs');
const widget = require('./widget');
const fmww = require('./fmwwService')

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

  console.log('launch')
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=500,500',
    ]
  });
  const page = await fmww.newPage(browser)
  console.log(process.env.FMWW_SIGN_IN_URL)
  await page.goto(process.env.FMWW_SIGN_IN_URL)

  await fmww.signIn(page)
  await fmww.decideMenuItem(page)

  const xs = janCodeList.length > 0 ? janCodeList : await fmww.fetchItems(page)
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
    await fmww.downloadProductsExcel(page, options)

    widget.progress(xs.length, (i+1))
    process.stdout.write("\033[1A")
  };

  await browser.close();
})();
