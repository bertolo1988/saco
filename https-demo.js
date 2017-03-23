const path = require('path');
const angularCliDemoPath = path.join(__dirname, '/examples/angular-cli');
const key = path.join(__dirname, '/examples/certificates/alice.key');
const cert = path.join(__dirname, '/examples/certificates/alice.crt');

let Saco = require('./dist/src/Server');
new Saco.Server({ folder: angularCliDemoPath, port: 3022, verbose: true, key, cert }).start();