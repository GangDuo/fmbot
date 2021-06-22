const program = require('commander');
const MovementController = require('./fm-client/controllers/movement');

program
  .option('-o, --output <file>', '標準出力ではなく<file>に出力を書き込みます。')
  .action(MovementController.export)
  .parse(process.argv)