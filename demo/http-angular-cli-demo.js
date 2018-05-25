const path = require("path");
const angularCliDemoPath = path.join(__dirname, "../examples/angular-cli");

let Saco = require("../dist/src/Server");
var server = new Saco.Server({
  rootPath: angularCliDemoPath,
  port: 3022,
  verbose: true,
  assets: { url: "/", path: "/" }
});

server
  .start()
  .then(() => {
    // return server.stop();
  })
  .catch(err => {
    console.log(err);
  });
