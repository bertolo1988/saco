/// <reference types="express" />
import { ServerOptions } from './ServerOptions';
import { Application } from 'express';
import * as Http from 'http';
import * as Https from 'https';
export declare class Server {
    startedWorkersCount: number;
    app: Application;
    server: Http.Server | Https.Server;
    options: ServerOptions;
    constructor(options: ServerOptions);
    private isHttps();
    private setMaxSockets();
    private appConfigure();
    private createServer();
    private startMaster();
    private sendMaster(pid, msg);
    private startWorker();
    start(): Promise<number>;
    stop(): Promise<any>;
}
