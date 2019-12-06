const MenuItem = require('./MenuItem')

module.exports = class MenuContext {
  //constructor(catergory, subcatergory, command, action);
  //constructor(menuItem, action);
  constructor() {
    const args = Array.from(arguments)
    let action = args[1]

    if(args[0] instanceof MenuItem) {
      this.menuItem_ = args[0]
    } else {
      this.menuItem_ = new MenuItem(args[0], args[1], args[2])
      action = args[3]
    }
    this.action_ = action
  }

  get catergory() { return this.menuItem_.catergory }
  get subcatergory() { return this.menuItem_.subcatergory }
  get command() { return this.menuItem_.command }
  get action() { return this.action_ }
}