const path = require('path');
const angularCliDemoPath = path.join(__dirname, '../examples/webpack-vue-cli');

let Saco = require('../dist/src/Server');
var server = new Saco.Server({ folder: angularCliDemoPath, port: 3022, verbose: true });

server.start().then(() => {
    return server.stop();
}).catch(err => {
    console.log(err);
});