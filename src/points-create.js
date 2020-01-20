const program = require('commander');
const PointsController = require('./fm-client/controllers/for-shop/customers/PointsController')

program
.action(PointsController.create)
.parse(process.argv)