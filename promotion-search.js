const program = require('commander');

program
.option('-b, --begin-date <date>', '設定日付 自', '今日')
.option('-e, --end-date <date>', '設定日付 至', '今日')
.option('-n, --setting-number <value>', '設定番号', '')
.action(options => {
  console.log(options.beginDate)
  console.log(options.endDate)
  console.log(options.settingNumber)
})
.parse(process.argv)