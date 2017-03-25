/// <reference types="express" />
/// <reference types="node" />
import { Application } from 'express';
import * as Http from 'http';
import * as Https from 'https';
export interface ServerOptions {
    folder: string;
    file?: string;
    favicon?: string;
    port?: number;
    dateformat?: string;
    verbose?: boolean;
    key?: string;
    cert?: string;
    workers?: number;
    maxAge?: number;
}
export declare class Server {
    readonly DEFAULT_OPTIONS: {
        file: string;
        port: number;
        dateformat: string;
        verbose: boolean;
        workers: number;
        maxAge: number;
    };
    app: Application;
    server: Http.Server | Https.Server;
    options: ServerOptions;
    constructor(options: ServerOptions);
    private setMaxSockets();
    private configure();
    private isHttps();
    private createServer();
    private killWorkers();
    private startMaster();
    private startWorker();
    start(): Promise<any>;
    stop(): Promise<any>;
}
