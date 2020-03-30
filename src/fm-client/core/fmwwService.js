const Native = require('../components/Native');
const ButtonSymbol = require('./ButtonSymbol');

// TODO: AbstractSinglePageへ移動したので削除予定
const waitUntilLoadingIsOver = async (page) => {
  const  disableTimeout = {timeout: 0}
  await page.waitFor(() => !!document.querySelector('#loading'), disableTimeout)
  await page.waitFor(() => document.querySelector('#loading').style.display === 'none', disableTimeout)
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
exports.createPromotion = createPromotion