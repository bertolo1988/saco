"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerOptions_1 = require("./ServerOptions");
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
const process = require("process");
const os = require("os");
const logError = debug('saco:error');
const logInfo = debug('saco:info');
var ClusterMessage;
(function (ClusterMessage) {
    ClusterMessage[ClusterMessage["WORKER_LISTENING"] = 0] = "WORKER_LISTENING";
})(ClusterMessage || (ClusterMessage = {}));
class Server {
    constructor(options) {
        this.startedWorkersCount = 0;
        this.app = express();
        this.options = Object.assign({}, ServerOptions_1.DEFAULT_OPTIONS, options);
        this.options.workers = Math.min(Math.max(this.options.workers, 1), os.cpus().length);
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
        if (this.options.behindProxy) {
            this.app.enable('trust proxy');
        }
        if (this.options.verbose) {
            this.app.use((req, res, next) => {
                logInfo(this.options.name, datefmt(new Date(), this.options.dateformat), 'pid:', process.pid, 'ip:', req.ip, '\t', req.method, '\t', req.url);
                next();
            });
        }
        this.app.use(this.options.assets.url, express.static(path.join(this.options.rootPath, this.options.assets.path), { maxAge: this.options.maxAge }));
        this.app.get(this.options.index.url, (req, res) => {
            res.sendFile(path.join(this.options.rootPath, this.options.index.path));
        });
        this.app.use((err, req, res, next) => {
            logError(datefmt(new Date(), this.options.dateformat), '\t:', req.method, req.url);
            logError(err.stack);
            res.status(500).send('Something broke!');
        });
        if (this.options.favicon != null) {
            this.app.use(this.options.favicon.url, favicon(path.join(this.options.rootPath, this.options.favicon.path)));
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
        return new Promise((resolve, reject) => {
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
                    logInfo('Server ready');
                    resolve(self.startedWorkersCount);
                }
            });
            cluster.on('online', worker => {
                logInfo('Process %O just went online', worker.process.pid);
            });
        });
    }
    sendMaster(pid, msg) {
        process.send({ pid, msg });
    }
    startWorker() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.server = self.createServer();
            self.server
                .listen(self.options.port, () => {
                self.sendMaster(process.pid, ClusterMessage.WORKER_LISTENING);
                resolve();
            })
                .on('error', () => {
                logError('Failed to start the server on port %O', self.options.port);
                reject();
            });
        });
    }
    // returnes a promise that resolves only after all workers
    // have sent ClusterMessage.WORKER_LISTENING to the master
    start() {
        var self = this;
        return new Promise((resolve, reject) => {
            if (cluster.isMaster) {
                logInfo(`Starting %O master %O...`, this.options.name, process.pid);
                logInfo('Options: %O', self.options);
                self.setMaxSockets();
                resolve(self.startMaster());
            }
            else {
                logInfo(`Starting %O worker %O...`, this.options.name, process.pid);
                self.startWorker();
            }
        });
    }
    // returnes a promise that resolves only after all
    // workers have send 'exit' event to the master
    stop() {
        return new Promise((resolve, reject) => {
            cluster.disconnect(() => {
                resolve();
            });
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map