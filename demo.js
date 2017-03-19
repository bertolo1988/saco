var Saco = require('./dist/Server');
var path = require('path');
let angularCliDemoPath = path.join(__dirname, '/examples/angular-cli');
new Saco.Server({ folder: angularCliDemoPath, port: 3022 }).start();