const path = require('path');
const puppeteer = require('puppeteer');
const {promisify} = require('util');
const fs = require('fs');
const widget = require('./widget');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

function debugOf(page) {
  const isDebug = false
  page.screenshotIfDebug = isDebug ? page.screenshot : () => { return Promise.resolve() }
  return page
}

// 部門コード全取得
// 戻り値：[[部門コード,部門名]]
const fetchItems = async (page) => {
  return await page
    .evaluate(async () => {
      return Array.from(document.getElementById('item_list:select').children).map(a => a.textContent.split(/\s+/))
    }, {timeout: 0})
}

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const download = async (page) => {
  return await page
    .evaluate(async () => {
      const form = document.querySelector('form[id="form1"]');
      const data = new FormData(form);
      data.set('form1:execute', 'execute')

      let xs={};
      for(var pair of data.entries()) {
        xs[pair[0]] = pair[1];
      }
      const params = createURLSearchParams(xs)
      return await ff(form.action, {
        method: 'POST',
        credentials: 'include',
        body: params,
      })

      function ff(action, op) {
        return new Promise((resolve) => {
          const req = new XMLHttpRequest();
          req.open(op.method, action, true)
          req.responseType = 'arraybuffer'
          req.withCredentials = true

          req.onload = function (oEvent) {
            let arrayBuffer = req.response;
            if (arrayBuffer) {
              let byteArray = new Uint8Array(arrayBuffer);
              resolve(byteArray)
            }
          };
          req.send(op.body);
        })
      }

      function createURLSearchParams(data) {
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => params.append(key, data[key]));
        return params;
      }
    }, {timeout: 0})
}

// 検索条件にマッチする商品マスタエクセルをローカル保存して、検索条件入力画面に戻す
const downloadProductsExcel = async (page, options) => {
  const itemCode = options.itemCode || ''
  const barcode = options.barcode || ''
  const prefix = itemCode ? itemCode + '_' : barcode + '_'
  const filename = prefix + 'products.xlsx'

  await page.evaluate(x => document.getElementById('item_list').value = x, itemCode)
  await page.evaluate(x => document.getElementById('barcode').value = x, barcode)
  await page.evaluate(x => document.getElementById('excel_button_ex').click())
  await page.waitFor(() => !!document.querySelector('#loading'), {timeout: 0})
  await page.waitFor(() => document.querySelector('#loading').style.display === 'none', {timeout: 0})
  await page.screenshotIfDebug({ path: 'is_ready_to_download_' + filename + '.png' });

  // ダウンロード処理
  const uint8 = await download(page)
  const xs = Object.keys(uint8).map(key => uint8[key])
  const content = Buffer.from(xs)
  // encodingをnullにして、生データのまま書き込む
  await writeFileAsync(path.join(options.saveTo, filename), content, {encoding: null});

  // 閉じるボタンをクリックして、非表示にしている検索条件入力画面を表示する
  await page.evaluate(_ => document.querySelector('div.excelDLDiv input[name=cls]').click())
  await sleep(500)
}

const signIn = async (page) => {
  await  page.waitForSelector('#form1\\:client')
  await Promise.all([
    page.evaluate(arg => {
      document.getElementById('form1:client').value = arg.FMWW_ACCESS_KEY_ID
      document.getElementById('form1:person').value = arg.FMWW_USER_NAME
      document.getElementById('form1:clpass').value = arg.FMWW_SECRET_ACCESS_KEY
      document.getElementById('form1:pspass').value = arg.FMWW_PASSWORD

      setTimeout(() => {
        document.getElementById('form1:login').click()
      }, 100)
    }, { FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
         FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
         FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
         FMWW_PASSWORD          : process.env.FMWW_PASSWORD }),
    page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'})
  ])
  console.log('signined')
  await page.screenshotIfDebug({ path: 'signined.png' });
}

const decideMenuItem = async (page) => {
  // 外部インターフェース -> 対HT -> 商品マスタメンテナンス -> 照会
  await page.waitForSelector('#menu\\:0 div:nth-child(14)')
  await page.waitForSelector('#menu\\:1 div:nth-child(1)')
  await page.evaluate(_ => {
    document.querySelector('#menu\\:0 div:nth-child(14)').click()
    document.querySelector('#menu\\:1 div:nth-child(1)').click()
  }),
  await page.waitForSelector('#menu\\:2 div:nth-child(4) div:nth-child(3)')
  console.log('menu')
  await page.screenshotIfDebug({ path: 'menu.png' });

  await Promise.all([
    page.evaluate(x => {
      document.querySelector('#menu\\:2 div:nth-child(4) div:nth-child(3)').click()
    }),
    page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'})
  ])
  await page.waitFor(() => !!document.querySelector('#loading'))
  await page.waitFor(() => document.querySelector('#loading').style.display === 'none')
  console.log('criteria')
  await page.screenshotIfDebug({ path: 'criteria.png' });
}

function red(s) {
  return '\u001b[31m' + s + '\u001b[0m'
}

(async () => {
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
  const page = debugOf(await browser.newPage())
  console.log(process.env.FMWW_SIGN_IN_URL)
  await page.goto(process.env.FMWW_SIGN_IN_URL)

  await signIn(page)
  await decideMenuItem(page)

  const xs = janCodeList.length > 0 ? janCodeList : await fetchItems(page)
  const width = 30
  for (let i = 0; i < xs.length; i++) {
    const msg = '[' + (i+1) + '/' + xs.length + ']: ' + xs[i]
    const formatedMsg = (width - msg.length) > 0 ? msg + ' '.repeat(width - msg.length) : msg.substr(0, width)
    process.stdout.write('\r' + formatedMsg + '\n')
    widget.progress(xs.length, i)

    let options = {saveTo: temp}
    if(janCodeList.length > 0) {
      options.barcode = xs[i]
    } else {
      options.itemCode = xs[i][0]
    }
    await downloadProductsExcel(page, options)

    widget.progress(xs.length, (i+1))
    process.stdout.write("\033[1A")
  };

  await browser.close();
})();
