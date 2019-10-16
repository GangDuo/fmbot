module.exports = class PromotionController {
  static onStart(options) {
    console.log(options.beginDate)
    console.log(options.endDate)
    console.log(options.settingNumber)  
  }
}