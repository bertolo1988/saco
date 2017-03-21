import { Request, Response, Application } from 'express';
import * as Http from 'http';
import * as Https from 'https';
import * as express from 'express';
import * as debug from 'debug';
import * as compression from 'compression';
import * as path from 'path';
import * as datefmt from 'dateformat';
import * as favicon from 'serve-favicon';
import * as fs from 'fs';

let logError: debug.IDebugger = debug('saco:error');
let logInfo: debug.IDebugger = debug('saco:info');

export interface SacoServerOptions {
    folder: string;
    file?: string;
    favicon?: string;
    port?: number;
    dateformat?: string;
    verbose?: boolean;
    key?: string;
    cert?: string;
}

export class Server {

    readonly DEFAULT_OPTIONS = {
        file: 'index.html',
        port: 4200,
        dateformat: 'GMT:HH:MM:ss dd-mmm-yy Z',
        verbose: false
    };
    app: Application = express();
    httpServer: Http.Server;
    httpsServer: Https.Server;
    options: SacoServerOptions;

    constructor(options: SacoServerOptions) {
        this.options = Object.assign({}, this.DEFAULT_OPTIONS, options);
        logInfo('Options: %O', this.options);
        this.configure();
    }

    configure() {
        this.app.use(compression());
        if (this.options.verbose) {
            this.app.use((req: Request, res: Response, next: Function) => {
                logInfo(datefmt(new Date(), this.options.dateformat), '\t:', req.method, req.url);
                next();
            });
        }
        this.app.use(express.static(this.options.folder));
        this.app.get('/*', (req, res) => {
            res.sendFile(path.join(this.options.folder, this.options.file));
        });
        this.app.use((err: Error, req: Request, res: Response, next: Function) => {
            logError(datefmt(new Date(), this.options.dateformat), '\t:', req.method, req.url);
            logError(err.stack);
            res.status(500).send('Something broke!');
        });
        if (this.options.favicon != null) {
            this.app.use(favicon(path.join(this.options.folder, this.options.favicon)));
        }
    }

    startHttpServer(): Promise<any> {
        let self = this;
        return new Promise(function(resolve, reject) {
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

    startHttpsServer(): Promise<any> {
        let self = this;
        return new Promise(function(resolve, reject) {
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

    start(): Promise<any> {
        if (this.isHttps()) {
            return this.startHttpsServer();
        } else {
            return this.startHttpServer();
        }
    }

    stop(): Promise<any> {
        if (this.isHttps()) {
            this.httpsServer.close();
            return Promise.resolve();
        } else {
            this.httpServer.close();
            return Promise.resolve();
        }
    }

};
