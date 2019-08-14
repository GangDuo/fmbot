const puppeteer = require('puppeteer');

function debugOf(page) {
  const isDebug = false
  page.screenshotIfDebug = isDebug ? page.screenshot : () => { return Promise.resolve() }
  return page
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

(async () => {
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

  await browser.close();
})();
