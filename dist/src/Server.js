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
var ClusterMessage;
(function (ClusterMessage) {
    ClusterMessage[ClusterMessage["WORKER_LISTENING"] = 0] = "WORKER_LISTENING";
})(ClusterMessage || (ClusterMessage = {}));
class Server {
    constructor(options) {
        this.DEFAULT_OPTIONS = {
            file: 'index.html',
            port: 4200,
            dateformat: 'GMT:HH:MM:ss dd-mmm-yy Z',
            verbose: false,
            workers: NUM_CPUS,
            maxAge: 43200000
        };
        this.startedWorkersCount = 0;
        this.app = express();
        this.options = Object.assign({}, this.DEFAULT_OPTIONS, options);
        this.options.workers = Math.min(Math.max(this.options.workers, 1), NUM_CPUS);
        this.appConfigure();
    }
    isHttps() {
        return this.options.key != null && this.options.cert != null;
    }
    setMaxSockets() {
        if (this.isHttps()) {
            Https.globalAgent.maxSockets = Infinity;
            logInfo('Https max sockets set to %O', Https.globalAgent.maxSockets);
        }
        else {
            Http.globalAgent.maxSockets = Infinity;
            logInfo('Http max sockets set to %O', Http.globalAgent.maxSockets);
        }
    }
    appConfigure() {
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
    createServer() {
        if (this.isHttps()) {
            logInfo('Starting https server on worker %O...', process.pid);
            let httpsOptions = {
                key: fs.readFileSync(this.options.key),
                cert: fs.readFileSync(this.options.cert)
            };
            return Https.createServer(httpsOptions, this.app);
        }
        else {
            logInfo('Starting http server on worker %O...', process.pid);
            return Http.createServer(this.app);
        }
    }
    startMaster() {
        var self = this;
        return new Promise(function (resolve, reject) {
            for (let i = 0; i < self.options.workers; i++) {
                cluster.fork();
            }
            cluster.on('exit', (worker, code, signal) => {
                logInfo(`Worker %O died`, worker.process.pid);
                self.startedWorkersCount--;
                if (self.startedWorkersCount === 0) {
                    logInfo('Bye');
                }
            });
            cluster.on('message', (worker, data) => {
                logInfo('Process %O listening on port %O', data.pid, self.options.port);
                self.startedWorkersCount++;
                if (self.startedWorkersCount === self.options.workers) {
                    logInfo('All workers connected successfully');
                    resolve(self.startedWorkersCount);
                }
            });
            cluster.on('online', (worker) => {
                logInfo('Process %O just went online', worker.process.pid);
            });
        });
    }
    sendMaster(pid, msg) {
        process.send({ pid, msg });
    }
    startWorker() {
        var self = this;
        self.server = self.createServer();
        self.server.listen(self.options.port, () => {
            self.sendMaster(process.pid, ClusterMessage.WORKER_LISTENING);
        }).on('error', () => {
            logError('Failed to start the server on port %O', self.options.port);
        });
    }
    start() {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (cluster.isMaster) {
                logInfo(`Starting master %O...`, process.pid);
                logInfo('Options: %O', self.options);
                self.setMaxSockets();
                resolve(self.startMaster());
            }
            else {
                logInfo(`Starting worker %O...`, process.pid);
                self.startWorker();
            }
        });
    }
    stop() {
        return new Promise(function (resolve, reject) {
            cluster.disconnect(() => {
                resolve();
            });
        });
    }
}
exports.Server = Server;
;
//# sourceMappingURL=Server.js.map