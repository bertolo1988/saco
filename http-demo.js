const path = require('path');
const angularCliDemoPath = path.join(__dirname, '/examples/angular-cli');

var Saco = require('./dist/Server');
new Saco.Server({ folder: angularCliDemoPath, port: 3022, verbose: true }).start();