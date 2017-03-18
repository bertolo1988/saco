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
let server;
class SacoServer {
    constructor(folder = 'dist', file = 'index.html', favicon = 'favicon.ico', port = 4200) {
        this.folder = folder;
        this.file = file;
        this.favicon = favicon;
        this.port = port;
        this.app = express();
        this.configure();
    }
    configure() {
        this.app.use(compression());
        this.app.use(express.static(path.join(__dirname, this.folder)));
        this.app.get('/*', function (req, res) {
            res.sendFile(path.join(__dirname, this.folder, this.file));
        });
        this.app.use((err, req, res, next) => {
            logError(datefmt(new Date(), 'GMT: HH:MM:ss dd-mmm-yy Z'), ':', req.url);
            logError(err.stack);
            res.status(500).send('Something broke!');
        });
        this.app.use(favicon(path.join(__dirname, this.folder, this.favicon)));
    }
    start() {
        this.configure();
        server = this.app.listen(this.port, () => {
            logInfo('Listening on port %O', this.port);
        });
    }
    stop() {
        this.server.close();
    }
}
exports.SacoServer = SacoServer;
;
//# sourceMappingURL=SacoServer.js.map