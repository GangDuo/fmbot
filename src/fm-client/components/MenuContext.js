module.exports = class MenuContext {
  constructor(catergory, subcatergory, command, action) {
    this.catergory_ = catergory
    this.subcatergory_ = subcatergory
    this.command_ = command
    this.action_ = action
  }

  get catergory() { return this.catergory_ }
  get subcatergory() { return this.subcatergory_ }
  get command() { return this.command_ }
  get action() { return this.action_ }
}