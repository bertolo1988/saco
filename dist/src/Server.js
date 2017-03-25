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
            workers: 1,
            maxAge: 43200000
        };
        this.app = express();
        this.options = Object.assign({}, this.DEFAULT_OPTIONS, options);
        this.options.workers = Math.min(this.options.workers, NUM_CPUS);
        this.configure();
    }
    setMaxSockets() {
        Http.globalAgent.maxSockets = Infinity;
        Https.globalAgent.maxSockets = Infinity;
        logInfo('Http max sockets set to %O', Http.globalAgent.maxSockets);
        logInfo('Https max sockets set to %O', Https.globalAgent.maxSockets);
    }
    configure() {
        this.app.use(compression());
        if (this.options.verbose) {
            this.app.use((req, res, next) => {
                logInfo(datefmt(new Date(), this.options.dateformat), 'pid:', process.pid, '\t:', req.method, req.url);
                next();
            });
        }
        this.app.use(express.static(this.options.folder, { maxAge: this.options.maxAge }));
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
    killWorkers() {
        for (let id in cluster.workers) {
            cluster.workers[id].kill();
        }
    }
    startMaster() {
        var self = this;
        return new Promise((resolve, reject) => {
            if (self.options.workers > 1) {
                for (let i = 0; i < self.options.workers; i++) {
                    cluster.fork();
                }
                cluster.on('exit', (worker, code, signal) => {
                    logInfo(`worker ${worker.process.pid} died`);
                    self.killWorkers();
                    process.exit(0);
                });
            }
            else {
                self.startWorker();
            }
            resolve();
        });
    }
    startWorker() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.server = self.createServer();
            self.server.listen(self.options.port, () => {
                logInfo('Listening on port %O', self.options.port);
                resolve();
            }).on('error', () => {
                logError('Failed to start the server on port %O', self.options.port);
                reject();
            });
        });
    }
    start() {
        if (cluster.isMaster) {
            logInfo(`Starting master %O...`, process.pid);
            logInfo('Options: %O', this.options);
            this.setMaxSockets();
            return this.startMaster();
        }
        else {
            logInfo(`Starting worker %O...`, process.pid);
            return this.startWorker();
        }
    }
    stop() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.server.on('close', resolve).on('error', reject);
            self.server.close();
        });
    }
}
exports.Server = Server;
;
//# sourceMappingURL=Server.js.map