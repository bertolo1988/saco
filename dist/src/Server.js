"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Https = require("https");
const express = require("express");
const debug = require("debug");
const compression = require("compression");
const path = require("path");
const datefmt = require("dateformat");
const favicon = require("serve-favicon");
const fs = require("fs");
let logError = debug('saco:error');
let logInfo = debug('saco:info');
class Server {
    constructor(options) {
        this.DEFAULT_OPTIONS = {
            file: 'index.html',
            port: 4200,
            dateformat: 'GMT:HH:MM:ss dd-mmm-yy Z',
            verbose: false
        };
        this.app = express();
        this.options = Object.assign({}, this.DEFAULT_OPTIONS, options);
        logInfo('Options: %O', this.options);
        this.configure();
    }
    configure() {
        this.app.use(compression());
        if (this.options.verbose) {
            this.app.use((req, res, next) => {
                logInfo(datefmt(new Date(), this.options.dateformat), '\t:', req.method, req.url);
                next();
            });
        }
        this.app.use(express.static(this.options.folder));
        this.app.get('/*', (req, res) => {
            res.sendFile(path.join(this.options.folder, this.options.file));
        });
        this.app.use((err, req, res, next) => {
            logError(datefmt(new Date(), this.options.dateformat), '\t:', req.method, req.url);
            logError(err.stack);
            res.status(500).send('Something broke!');
        });
        if (this.options.favicon != null) {
            this.app.use(favicon(path.join(this.options.folder, this.options.favicon)));
        }
    }
    startHttpServer() {
        let self = this;
        return new Promise(function (resolve, reject) {
            logInfo('Starting http server...');
            self.httpServer = self.app.listen(self.options.port, () => {
                logInfo('Listening on port %O', self.options.port);
                resolve();
            }).on('error', () => {
                logError('Failed to start the server on port %O', self.options.port);
                reject();
            });
        });
    }
    isHttps() {
        return this.options.key != null && this.options.cert != null;
    }
    startHttpsServer() {
        let self = this;
        return new Promise(function (resolve, reject) {
            logInfo('Starting https server...');
            let httpsOptions = {
                key: fs.readFileSync(self.options.key),
                cert: fs.readFileSync(self.options.cert)
            };
            self.httpsServer = Https.createServer(httpsOptions, self.app);
            self.httpsServer.listen(self.options.port, () => {
                logInfo('Listening on port %O', self.options.port);
                resolve();
            }).on('error', () => {
                logError('Failed to start the server on port %O', self.options.port);
                reject();
            });
        });
    }
    start() {
        if (this.isHttps()) {
            return this.startHttpsServer();
        }
        else {
            return this.startHttpServer();
        }
    }
    stop() {
        let self = this;
        return new Promise(function (resolve, reject) {
            if (self.isHttps()) {
                self.httpsServer.on('close', resolve).on('error', reject);
                self.httpsServer.close();
            }
            else {
                self.httpServer.on('close', resolve).on('error', reject);
                self.httpServer.close();
            }
        });
    }
}
exports.Server = Server;
;
//# sourceMappingURL=Server.js.map