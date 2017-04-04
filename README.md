# Saco

A pre customized, express server for single page web apps that aims to be production ready.
Saco promotes separation of concerns, quality, best practices and testability when deploying front end single page web apps. 

[![dependencies Status](https://david-dm.org/bertolo1988/saco/status.svg)](https://david-dm.org/bertolo1988/saco)
[![npm version](https://badge.fury.io/js/saco.svg)](https://badge.fury.io/js/saco)
[![Build Status](https://travis-ci.org/bertolo1988/saco.svg?branch=master)](https://travis-ci.org/bertolo1988/saco)

## By using Saco

...you avoid the following common mistakes:

* using development servers in production
* poluting your front end project with several dependencies that are only used in the production server launch
* having your front end app on the same server of your back end server
* using non [nodejs](https://nodejs.org/en/) solutions
* misconfiguration

and benefit from having: 

* [expressjs](https://expressjs.com/) properly configured for production
* http && https static folder hosting
* high quality and tested code launching your production server
* beautifully bootstrapped cluster with stop and start methods
* favicon hosted with [serve-favicon](https://github.com/expressjs/serve-favicon)
* gzip with [compression](https://github.com/expressjs/compression)
* customizable logging with [debug](https://github.com/visionmedia/debug)
* [customizable format timestamps](https://github.com/felixge/node-dateformat)
* [multi core server](https://nodejs.org/docs/latest/api/cluster.html)
* resource caching
* minification - not yet available

## Demo

`npm run http-demo`, `npm run https-demo` or `npm run cluster-https-demo`

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

5. Run it as: `cross-env NODE_ENV=production DEBUG=saco:* node my-script.js`.

Notice that we used [cross-env](https://github.com/kentcdodds/cross-env) to set the environment variables. You may use another method.

## Behind a proxy

If your saco instance is behind proxy such as [nginx](https://www.nginx.com/resources/wiki/), in order to have the request ip properly shown in the console
do not forget to set the option `behindProxy` to true. 

This will configure our server to trust a proxy and behave as explained [here](https://expressjs.com/en/guide/behind-proxies.html).

If your reverse proxy is Nginx you can add this `proxy_set_header X-Forwarded-For $remote_addr;` in your `.conf` file.

This will allow redefining or appending fields to the request header passed to the proxied server.


## Server API

```
constructor(options: ServerOptions) 
```

```
// returnes a promise that resolves only after all workers
// have sent ClusterMessage.WORKER_LISTENING to the master
start(): Promise<number>
```

```
// returnes a promise that resolves only after all
// workers have send 'exit' event to the master
stop(): Promise<any> 
```


## Options

Saco server supports the following options:

[Link to ServerOptions.ts.](/src/ServerOptions.ts)

Values with `?` are optional.

[Link to default options here.](/src/Server.ts#L26-L34)

In order to have an https server `key` and `cert` paths must be defined.

Workers has a default and maximum value equal to the number of cores of your processor.

## Linting

`npm run lint`

## Testing

`npm run test`

## Logging

Use `DEBUG=saco:* npm run your-launcher.js` to have the logs printed on your console.

## Contributing

Contributions will be highly appreciated.

Feel free to open any issues on any related matter.

## LICENSE

Code released under the [MIT license](./LICENSE).