# saco

A pre customized, production ready, express server for single page web apps.

## How to use

1. Create a folder `mkdir my-saco-launcher` and `cd` into it.

2. Start new npm project with `npm init -y` and drag your single page web app files inside. 

3. `npm i --save saco`

4. Create a script such as:

```javascript
const path = require('path');
const Saco = require('saco');
new Saco.Server( { "folder" : path.join(__dirname, '/dist' )} ).start();
```

5. Run it as: `DEBUG:saco:* node my-script.js`.

## Demo

`npm run http-demo` or `npm run https-demo` and it will host a sample angular 2 single page web app built with [angular-cli](https://github.com/angular/angular-cli).

## Main features

* http && https static folder hosting
* default redirection to an entry point
* start & stop methods
* favicon hosted with [serve-favicon](https://github.com/expressjs/serve-favicon)
* gzip with [compression](https://github.com/expressjs/compression)
* customizable logging with [debug](https://github.com/visionmedia/debug)
* [customizable format timestamps](https://github.com/felixge/node-dateformat) 

## Coming soon

* minification

## Options

Saco server supports the following options:
```javascript
readonly DEFAULT_OPTIONS = {
    folder: path.join(__dirname, 'dist'),
    file: 'index.html',
    favicon: 'favicon.ico',
    port: 4200,
    dateformat: 'GMT:HH:MM:ss dd-mmm-yy Z',
    verbose: false
};
```

In order to have an https server `key` and `cert` paths must be defined.

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