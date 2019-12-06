module.exports = class MenuItem {
  constructor(catergory, subcatergory, command) {
    this.catergory_ = catergory
    this.subcatergory_ = subcatergory
    this.command_ = command
  }

  get catergory() { return this.catergory_ }
  get subcatergory() { return this.subcatergory_ }
  get command() { return this.command_ }
}