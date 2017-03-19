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
let server;

export class SacoServer {

    app: Application = express();
    server: Http.Server;

    constructor(private folder: string = path.join(__dirname, 'dist'), private file: string = 'index.html', private favicon: string = 'favicon.ico', private port: number = 4200) {
        this.configure();
    }

    configure() {
        this.app.use(compression());
        this.app.use(express.static(this.folder));
        this.app.get('/*', function (req, res) {
            res.sendFile(path.join(this.folder, this.file));
        });
        this.app.use((err: Error, req: Request, res: Response, next: Function) => {
            logError(datefmt(new Date(), 'GMT: HH:MM:ss dd-mmm-yy Z'), ':', req.url);
            logError(err.stack);
            res.status(500).send('Something broke!');
        });
        this.app.use(favicon(path.join(this.folder, this.favicon)));
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

};
