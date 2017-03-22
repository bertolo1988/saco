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
}
export declare class Server {
    readonly DEFAULT_OPTIONS: {
        file: string;
        port: number;
        dateformat: string;
        verbose: boolean;
    };
    app: Application;
    httpServer: Http.Server;
    httpsServer: Https.Server;
    options: ServerOptions;
    constructor(options: ServerOptions);
    configure(): void;
    startHttpServer(): Promise<any>;
    isHttps(): boolean;
    startHttpsServer(): Promise<any>;
    start(): Promise<any>;
    stop(): Promise<any>;
}
