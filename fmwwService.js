const puppeteer = require('puppeteer');
const path = require('path');
const {promisify} = require('util');
const fs = require('fs');
var Native = require('./Native');

const writeFileAsync = promisify(fs.writeFile);

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const waitUntilLoadingIsOver = async (page) => {
  const  disableTimeout = {timeout: 0}
  await page.waitFor(() => !!document.querySelector('#loading'), disableTimeout)
  await page.waitFor(() => document.querySelector('#loading').style.display === 'none', disableTimeout)
}

function debugOf(page) {
  const isDebug = false
  page.screenshotIfDebug = isDebug ? page.screenshot : () => { return Promise.resolve() }
  return page
}

const createBrowserInstance = () => {
  return new Promise(async (success, failure) => {
    try{
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--window-size=500,500',
        ]
      });
      success(browser)
    } catch (err) {
      failure(err)
    }
  })
}

const newPage = async (browser) => {
  return debugOf(await browser.newPage())
}

// 部門コード全取得
// 戻り値：[[部門コード,部門名]]
const fetchItems = async (page) => {
  return await page
    .evaluate(async () => {
      return Array.from(document.getElementById('item_list:select').children).map(a => a.textContent.split(/\s+/))
    }, {timeout: 0})
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
  const prefix = options.prefix ? options.prefix : (itemCode ? itemCode + '_' : barcode + '_')
  const filename = prefix + 'products.xlsx'

  await page.evaluate(x => document.getElementById('item_list').value = x, itemCode)
  await page.evaluate(x => document.getElementById('barcode').value = x, barcode)
  await page.evaluate(Native.clickExcelButton)
  await waitUntilLoadingIsOver(page)
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

const signIn = async (page, user) => {
  await  page.waitForSelector('#form1\\:client')
  await Promise.all([
    page.evaluate(Native.signIn, user || {
         FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
         FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
         FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
         FMWW_PASSWORD          : process.env.FMWW_PASSWORD }),
    page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'})
  ])
  console.log('signined')
  await page.screenshotIfDebug({ path: 'signined.png' });
  return Promise.resolve(true)
}

const decideMenuItem = async (page, context) => {
  const catergory = context.catergory
  const subcatergory = context.subcatergory
  const command = context.command
  const action = context.action

  // 外部インターフェース -> 対HT -> 商品マスタメンテナンス -> 照会
  await page.waitForSelector('#menu\\:0 div:nth-child(' + catergory + ')')
  await page.evaluate((catergory, subcatergory) => {
    document.querySelector('#menu\\:0 div:nth-child(' + catergory + ')').click()
    document.querySelector('#menu\\:1 div:nth-child(' + subcatergory + ')').click()
  }, catergory, subcatergory),
  await page.waitForSelector('#menu\\:2 div:nth-child(' + command + ') div:nth-child(' + action + ')')
  console.log('menu')
  await page.screenshotIfDebug({ path: 'menu.png' });

  await Promise.all([
    page.evaluate((command, action) => {
      document.querySelector('#menu\\:2 div:nth-child(' + command + ') div:nth-child(' + action + ')').click()
    }, command, action),
    page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'})
  ])
  await waitUntilLoadingIsOver(page)
  console.log('criteria')
  await page.screenshotIfDebug({ path: 'criteria.png' });
}

const updateSupplier = async (page, options) => {
  if(!options.id) {
    throw new Error('')
  }
  await page.evaluate(x => {
    ['sup_cd_from', 'sup_cd_to'].forEach((id) => {
      document.getElementById(id).value = x
    })
  }, options.id)
  await page.evaluate(Native.clickSearchButton)
  await waitUntilLoadingIsOver(page)
  // 仕入先一覧の先頭行をクリック
  await page.evaluate(_ => document.querySelector('table.body_table tr:nth-child(2) td').click())
  await waitUntilLoadingIsOver(page)
  // 編集
  await page.evaluate(supplierName => {
    if(supplierName) {
      document.getElementById('sup_nm').value = supplierName  // 名称
    }
  }, options.supplierName)
  // 保存
  await page.evaluate(supplierName => {
    // 確認ダイアログ無効
    window.confirm = () => { return true }
    document.getElementById('register_button').click()
  })
  await waitUntilLoadingIsOver(page)
  const result = await page.evaluate(_ => document.getElementById('form1:errorMessage').textContent)
  // 仕入先一覧ページへ戻る
  await page.evaluate(Native.clickQuitButton)
  await waitUntilLoadingIsOver(page)
  // 仕入先検索ページへ戻る
  await page.evaluate(Native.clickQuitButton)
  await waitUntilLoadingIsOver(page)
  return {
    message: result
  }
}

exports.createBrowserInstance = createBrowserInstance
exports.newPage = newPage
exports.fetchItems = fetchItems
exports.downloadProductsExcel = downloadProductsExcel
exports.signIn = signIn
exports.decideMenuItem = decideMenuItem
exports.updateSupplier = updateSupplier