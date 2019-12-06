const MenuContext = require('../../src/fm-client/components/MenuContext');
const MenuItem = require('../../src/fm-client/components/MenuItem')

describe('MenuContext', function () {
  before(function() {
  }) 
  
  after(function() {
  }) 

  it('create instance', function () {
    const ins = new MenuContext(1, 2, 3, 4)

    expect(ins.catergory).to.equal(1)
    expect(ins.subcatergory).to.equal(2)
    expect(ins.command).to.equal(3)
    expect(ins.action).to.equal(4)
  });

  it('create instance with MenuItem', function () {
    const ins = new MenuContext(new MenuItem(1, 2, 3), 4)

    expect(ins.catergory).to.equal(1)
    expect(ins.subcatergory).to.equal(2)
    expect(ins.command).to.equal(3)
    expect(ins.action).to.equal(4)
  });
})