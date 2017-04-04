/// <reference types="express" />
/// <reference types="node" />
import { ServerOptions } from './ServerOptions';
import { Application } from 'express';
import * as Http from 'http';
import * as Https from 'https';
export declare class Server {
    readonly DEFAULT_OPTIONS: {
        file: string;
        port: number;
        dateformat: string;
        verbose: boolean;
        workers: number;
        maxAge: number;
        behindProxy: boolean;
    };
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
