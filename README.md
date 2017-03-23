# Saco

A pre customized, express server for single page web apps that aims to be production ready.
Saco promotes separation of concerns, quality, best practices and testability when deploying front end single page web apps. 

[![dependencies Status](https://david-dm.org/bertolo1988/saco/status.svg)](https://david-dm.org/bertolo1988/saco)
[![npm version](https://badge.fury.io/js/saco.svg)](https://badge.fury.io/js/saco)

## By using Saco

...you avoid the following common mistakes:

* using development servers in production
* poluting your front end project with several dependencies that are only used in the production server launch
* having your front end app on the same server of your back end server
* using non [nodejs](https://nodejs.org/en/) solutions

and benefit from having: 

* http && https static folder hosting
* default redirection to an entry point
* high quality and tested code launching your production server
* beautifully bootstrapped code with stop and start methods
* favicon hosted with [serve-favicon](https://github.com/expressjs/serve-favicon)
* gzip with [compression](https://github.com/expressjs/compression)
* customizable logging with [debug](https://github.com/visionmedia/debug)
* [customizable format timestamps](https://github.com/felixge/node-dateformat)
* clusterization - not yet available
* minification - not yet available

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

## Options

Saco server supports the following options:
```typescript
export interface ServerOptions {
    folder: string;
    file?: string;
    favicon?: string;
    port?: number;
    dateformat?: string;
    verbose?: boolean;
    key?: string;
    cert?: string;
}
```
Values with `?` are optional.

Default values:

```typescript
readonly DEFAULT_OPTIONS = {
    file: 'index.html',
    port: 4200,
    dateformat: 'GMT:HH:MM:ss dd-mmm-yy Z',
    verbose: false
};
```

In order to have an https server `key` and `cert` paths must be defined.

## Testing

`npm run test`

## Linting

`npm run lint`

## Logging

Use `DEBUG=saco:* npm run your-launcher.js` to have the logs printed on your console.

## Contributing

Contributions will be highly appreciated.

Feel free to open any issues on any related matter.

## LICENSE

Code released under the [MIT license](./LICENSE).