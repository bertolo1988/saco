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
            folder: path.join(__dirname, 'dist'),
            file: 'index.html',
            favicon: 'favicon.ico',
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
        this.app.use(favicon(path.join(this.options.folder, this.options.favicon)));
    }
    startHttpServer() {
        logInfo('Starting http server...');
        this.httpServer = this.app.listen(this.options.port, () => {
            logInfo('Listening on port %O', this.options.port);
        });
    }
    startHttpsServer() {
        logInfo('Starting https server...');
        let httpsOptions = {
            key: fs.readFileSync(this.options.key),
            cert: fs.readFileSync(this.options.cert)
        };
        this.httpsServer = Https.createServer(httpsOptions, this.app);
        this.httpsServer.listen(this.options.port, () => {
            logInfo('Listening on port %O', this.options.port);
        });
    }
    isHttps() {
        return this.options.key != null && this.options.cert != null;
    }
    start() {
        if (this.isHttps()) {
            this.startHttpsServer();
        }
        else {
            this.startHttpServer();
        }
    }
    stop() {
        if (this.isHttps()) {
            this.httpsServer.close();
        }
        else {
            this.httpServer.close();
        }
    }
}
exports.Server = Server;
;
//# sourceMappingURL=Server.js.map