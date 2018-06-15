# Saco

A pre customized, express server for single page web apps that aims to be production ready.
Saco promotes separation of concerns, quality, best practices and testability when deploying front end single page web apps. 

[![dependencies Status](https://david-dm.org/bertolo1988/saco/status.svg)](https://david-dm.org/bertolo1988/saco)
[![devDependencies Status](https://david-dm.org/bertolo1988/saco/dev-status.svg)](https://david-dm.org/bertolo1988/saco?type=dev)
[![npm version](https://badge.fury.io/js/saco.svg)](https://badge.fury.io/js/saco)
[![Build Status](https://travis-ci.org/bertolo1988/saco.svg?branch=master)](https://travis-ci.org/bertolo1988/saco)
[![Maintainability](https://api.codeclimate.com/v1/badges/bee30e158db90b070049/maintainability)](https://codeclimate.com/github/bertolo1988/saco/maintainability)


## By using Saco

...you avoid the following common mistakes:

* using development servers in production
* poluting your front end project with extra dependencies
* having your front end app on the same server of your back end server
* using non [nodejs](https://nodejs.org/en/) solutions
* incomplete production configuration

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
* configured to work behind proxies

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
new Saco.Server( { "rootPath" : path.join(__dirname, '/dist' )} ).start();
```

5. Run it as: `cross-env NODE_ENV=production DEBUG=saco:* node my-script.js`.

Notice that we used [cross-env](https://github.com/kentcdodds/cross-env) to set the environment variables. You may use another method.

## How does it work exactly?

Well... Take a look at the code, its not much.

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

Remember values with `?` are optional.

In order to have an https server `key` and `cert` paths must be defined.

Workers has a default and maximum value equal to the number of cores of your processor.

| option | What it does |
|-------------|------------------------------------------------------------------------------------|
| name | Just a string to easily identify the server in the log. |
| port | Where the server is going to listen. |
| ip | The address where the server will be. For most cases this should be either 'localhost or '0.0.0.0'. |
| cors | Set to true if you want to allow cross origin requests. |
| dateformat | String describing logs dateformat. Must be supported by [dateformat npm package](https://www.npmjs.com/package/dateformat). |
| verbose | Set to true if you want to have logs in the console. |
| key  | HTTPS key. |
| cert | HTTPS certificate. |
| workers | Number of forks. Default value depends on number of processor cores. |
| maxAge | Specifies, in milliseconds, for how long should resources stay in client cache. |
| behindProxy | Enables trust proxy header. |
| rootPath | Specify the path where the resources will be in the server local hard drive. |
| index | Expects an object with url and path. Path is the relative path from rootPath until the file and url is the default url used by the server. |
| assets | Same as index but for the assets used by the page. |
| favicon | Same as index but for favicon file. |

## Linting

`npm run lint`

## Testing

`npm run test`

## Logging

Use `DEBUG=saco:* npm run your-launcher.js` to have the logs printed on your console.

## Contributing

Contributions will be highly appreciated.

Feel free to open any issues on any related matter.

Recommended versions

* node : v8.11.2

* npm: 5.6.0

* typescript: 2.8.3

## LICENSE

Code released under the [MIT license](./LICENSE).
