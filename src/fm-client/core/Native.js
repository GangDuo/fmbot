module.exports = class Native {
  static clickSearchButton(x) {
    document.getElementById('search_button').click()
  }

  static clickExcelButton(x) {
    document.getElementById('excel_button_ex').click()
  }

  static clickQuitButton() {
    document.getElementById('quit_button').click()
  }

  static clickRegisterButton() {
    document.getElementById('register_button').click()
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