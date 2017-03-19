"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const debug = require("debug");
const compression = require("compression");
const path = require("path");
const datefmt = require("dateformat");
const favicon = require("serve-favicon");
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
        this.app.get('/*', function (req, res) {
            res.sendFile(path.join(this.folder, this.file));
        });
        this.app.use((err, req, res, next) => {
            logError(datefmt(new Date(), this.options.dateformat), '\t:', req.method, req.url);
            logError(err.stack);
            res.status(500).send('Something broke!');
        });
        this.app.use(favicon(path.join(this.options.folder, this.options.favicon)));
    }
    start() {
        this.configure();
        this.server = this.app.listen(this.options.port, () => {
            logInfo('Listening on port %O', this.options.port);
        });
    }
    stop() {
        this.server.close();
    }
}
exports.Server = Server;
;
//# sourceMappingURL=Server.js.map