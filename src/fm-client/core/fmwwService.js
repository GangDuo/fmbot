const path = require('path');
const Native = require('../components/Native');
const ButtonSymbol = require('./ButtonSymbol');
const debug = require('../../diagnostics/debug')
const {sleep, writeFileAsync} = require('../components/Helpers');

// TODO: AbstractSinglePageへ移動したので削除予定
const getDisplayedErrorMessage = async (page) => {
  return await page.evaluate(_ => document.getElementById('form1:errorMessage').textContent)
}

// TODO: AbstractSinglePageへ移動したので削除予定
const waitUntilLoadingIsOver = async (page) => {
  const  disableTimeout = {timeout: 0}
  await page.waitFor(() => !!document.querySelector('#loading'), disableTimeout)
  await page.waitFor(() => document.querySelector('#loading').style.display === 'none', disableTimeout)
}

// TODO: AbstractSinglePageへ移動したので削除予定
const closeDownloadBox = async (page) => {
  // 閉じるボタンをクリックして、非表示にしている検索条件入力画面を表示する
  await page.evaluate(_ => document.querySelector('div.excelDLDiv input[name=cls]').click())
  await sleep(500)
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
  await page.evaluate(Native.performClick(), ButtonSymbol.EXCEL)
  await waitUntilLoadingIsOver(page)
  await page.screenshotIfDebug({ path: 'is_ready_to_download_' + filename + '.png' });

  // ダウンロード処理
  const uint8 = await download(page)
  const xs = Object.keys(uint8).map(key => uint8[key])
  const content = Buffer.from(xs)
  // encodingをnullにして、生データのまま書き込む
  await writeFileAsync(path.join(options.saveTo, filename), content, {encoding: null});
  await closeDownloadBox(page)
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
  debug.log('menu')
  await page.screenshotIfDebug({ path: 'menu.png' });

  await Promise.all([
    page.evaluate((command, action) => {
      document.querySelector('#menu\\:2 div:nth-child(' + command + ') div:nth-child(' + action + ')').click()
    }, command, action),
    page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'})
  ])
  await waitUntilLoadingIsOver(page)
  debug.log('criteria')
  await page.screenshotIfDebug({ path: 'criteria.png' });
}

const createPromotion = async (page, options) => {
  await page.evaluate((from, to, rate, targets = []) => {
    // 設定日付
    document.getElementById('dateFrom').value = from
    document.getElementById('dateTo').value = to
    // 対象店舗を選択
    for(const element of Array.from(document.querySelectorAll('#dest\\:SELECT span'))) {
      if(targets.includes(element.value)) {
        element.setAttribute('selected', 'selected')
        element.className = "selected";
      }
    }
    // 対象店舗をDBに登録するため、hiddenに値を保存
    document.getElementById('dest').value = Array.from(document.querySelectorAll('#dest\\:SELECT span'))
      .filter(x => x.getAttribute('selected') === 'selected')
      .map(x => x.value)
      .join('\t')

    // 倍率
    typeInPointInfo(rate)

    /*
     * ポイントn倍設定
     * 新規登録時に優先度をnに設定する。
     * 編集時に優先度を変更しない。
     */
    function typeInPointInfo(n) {
      if(n < 1) {
        return;
      }
      document.getElementById('input_2:0').value = 1;
      document.getElementById('input_5:0').value = 1;
      document.getElementById('input_6:0').value = 1;
      document.getElementById('input_7:0').value = 100;
      document.getElementById('input_8:0').value = n;
      if(document.querySelector('#title span').textContent === 'ポイント設定') {
        document.getElementById('setSeq').value = n;
      }
    }
  },
  options.between.from,
  options.between.to,
  options.rate,
  options.targets)

  await page.evaluate(Native.disableConfirmationDialog)
  await page.evaluate(_ => {
    document.getElementById('dateFrom').onblur()
    document.getElementById('dateTo').onblur()
  })
  await page.evaluate(Native.performClick(), ButtonSymbol.REGISTER)
  await waitUntilLoadingIsOver(page)
}

exports.download = download
exports.fetchItems = fetchItems
exports.downloadProductsExcel = downloadProductsExcel
exports.decideMenuItem = decideMenuItem
exports.createPromotion = createPromotion