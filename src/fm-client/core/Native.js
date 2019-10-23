module.exports = class Native {
  static performClick() {
    return id => document.getElementById(id).click()
  }

  static signIn(arg) {
    document.getElementById('form1:client').value = arg.FMWW_ACCESS_KEY_ID
    document.getElementById('form1:person').value = arg.FMWW_USER_NAME
    document.getElementById('form1:clpass').value = arg.FMWW_SECRET_ACCESS_KEY
    document.getElementById('form1:pspass').value = arg.FMWW_PASSWORD

    setTimeout(() => {
      document.getElementById('form1:login').click()
    }, 100)
  }

  // 確認ダイアログを上書きして無効にします。
  static disableConfirmationDialog() {
    window.confirm = () => { return true }
    window.alert = () => { return true }
  }
}