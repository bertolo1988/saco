import { Request, Response, Application, Router } from 'express';
import * as Http from 'http';
import * as express from 'express';
import * as debug from 'debug';
import * as compression from 'compression';
import * as path from 'path';
import * as datefmt from 'dateformat';
import * as favicon from 'serve-favicon';

let logError: debug.IDebugger = debug('saco:error');
let logInfo: debug.IDebugger = debug('saco:info');

export interface SacoServerOptions {
    folder: string;
    file: string;
    favicon: string;
    port: number;
}

export class Server {

    readonly DEFAULT_OPTIONS = {
        folder: path.join(__dirname, 'dist'),
        file: 'index.html',
        favicon: 'favicon.ico',
        port: 4200
    };
    app: Application = express();
    server: Http.Server;
    options: SacoServerOptions;

    constructor(options: SacoServerOptions) {
        this.options = Object.assign({}, this.DEFAULT_OPTIONS, options);
        this.configure();
    }

    configure() {
        this.app.use(compression());
        this.app.use(express.static(this.options.folder));
        this.app.get('/*', function (req, res) {
            res.sendFile(path.join(this.folder, this.file));
        });
        this.app.use((err: Error, req: Request, res: Response, next: Function) => {
            logError(datefmt(new Date(), 'GMT: HH:MM:ss dd-mmm-yy Z'), ':', req.url);
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

};
