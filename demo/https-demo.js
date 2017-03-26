const path = require('path');
const angularCliDemoPath = path.join(__dirname, '../examples/webpack-vue-cli');
const key = path.join(__dirname, '../examples/certificates/alice.key');
const cert = path.join(__dirname, '../examples/certificates/alice.crt');

let Saco = require('../dist/src/Server');
var server = new Saco.Server({ folder: angularCliDemoPath, port: 3022, verbose: true, key, cert });

server.start().then(() => {
    return server.stop();
}).catch(err => {
    console.log(err);
});