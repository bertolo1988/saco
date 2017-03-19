# saco

A pre customized, production ready, express server for single page web apps.

## How to use

1. Create a folder `mkdir my-saco-launcher` and `cd` into it.

2. Start new npm project with `npm init -y` and drag your single page web app files inside. 

3. `npm i --save saco`

4. Create a script such as:

```javascript
const path = require('path');
var Saco = require('saco');
var server = new Saco.SacoServer(path.join(__dirname, '/dist'), 'index.html', 'favicon.ico', 4200);
server.start();
```

5. Run it as: `DEBUG:saco:* node my-script.js`.


## Main features

* http static folder host
* error logging with timestamps
* start & stop methods
* favicon hosted with [serve-favicon](https://github.com/expressjs/serve-favicon)
* gzip with [compression](https://github.com/expressjs/compression)

## Coming soon

* https
* morgan
* customizable timestamps
* minification

## Options

Saco server supports the following options:
* folder - the root folder of your web app
* file - the main file of your web app
* favicon - the path from folder to the favicon
* port - the port to listen to

## Running

```javascript
const path = require('path');
var Saco = require('saco');
var server = new Saco.SacoServer(path.join(__dirname, '/dist'), 'index.html', 'favicon.ico', 4200);
server.start();
```

## Logging

Use `DEBUG=saco:* npm run your-launcher.js` to have the logs printed on your console.

## Testing

// todo

## Issues and suggestions

Feel free to open any issues on any matter.

## Contributing

Do not forget to respect the linting rules. 

Feel free to send pull requests.

## LICENSE

MIT