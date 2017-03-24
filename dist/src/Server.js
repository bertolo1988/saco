"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Https = require("https");
const express = require("express");
const debug = require("debug");
const compression = require("compression");
const path = require("path");
const datefmt = require("dateformat");
const favicon = require("serve-favicon");
const fs = require("fs");
const cluster = require("cluster");
const os = require("os");
const process = require("process");
const NUM_CPUS = os.cpus().length;
const logError = debug('saco:error');
const logInfo = debug('saco:info');
class Server {
    constructor(options) {
        this.DEFAULT_OPTIONS = {
            file: 'index.html',
            port: 4200,
            dateformat: 'GMT:HH:MM:ss dd-mmm-yy Z',
            verbose: false,
            workers: 1
        };
        this.app = express();
        this.options = Object.assign({}, this.DEFAULT_OPTIONS, options);
        this.options.workers = this.options.workers > NUM_CPUS ? NUM_CPUS : this.options.workers;
        this.configure();
    }
    configure() {
        this.app.use(compression());
        if (this.options.verbose) {
            this.app.use((req, res, next) => {
                logInfo(datefmt(new Date(), this.options.dateformat), 'pid:', process.pid, '\t:', req.method, req.url);
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
    isHttps() {
        return this.options.key != null && this.options.cert != null;
    }
    createServer() {
        if (this.isHttps()) {
            logInfo('Starting https server...');
            let httpsOptions = {
                key: fs.readFileSync(this.options.key),
                cert: fs.readFileSync(this.options.cert)
            };
            return Https.createServer(httpsOptions, this.app);
        }
        else {
            logInfo('Starting http server...');
            return Http.createServer(this.app);
        }
    }
    startMaster() {
        var self = this;
        return new Promise((resolve, reject) => {
            logInfo(`Master ${process.pid} is running`);
            logInfo('Options: %O', self.options);
            for (let i = 0; i < self.options.workers; i++) {
                cluster.fork();
            }
            cluster.on('exit', (worker, code, signal) => {
                logInfo(`worker ${worker.process.pid} died`);
            });
            resolve();
        });
    }
    startWorker() {
        var self = this;
        return new Promise((resolve, reject) => {
            logInfo(`Starting worker ${process.pid}...`);
            self.server = self.createServer();
            self.server.listen(self.options.port, () => {
                logInfo('Listening on port %O', self.options.port);
                resolve();
            }).on('error', () => {
                logError('Failed to start the server on port %O', self.options.port);
                reject();
            });
            logInfo(`Worker ${process.pid} started`);
        });
    }
    start() {
        if (cluster.isMaster) {
            return this.startMaster();
        }
        else {
            return this.startWorker();
        }
    }
    stop() {
        let self = this;
        return new Promise((resolve, reject) => {
            self.server.on('close', resolve).on('error', reject);
            self.server.close();
        });
    }
}
exports.Server = Server;
;
//# sourceMappingURL=Server.js.map