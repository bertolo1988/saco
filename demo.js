// this 2 lines create the path to the root folder of our web app
var path = require('path');
let angularCliDemoPath = path.join(__dirname, '/examples/angular-cli');

// all we need to start our server
var Saco = require('./dist/Server');
new Saco.Server({ folder: angularCliDemoPath, port: 3022, verbose: true }).start();