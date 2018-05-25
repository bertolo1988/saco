export interface ServerOptions {
    name?: string;
    port?: number;
    dateformat?: string;
    verbose?: boolean;
    key?: string;
    cert?: string;
    workers?: number;
    maxAge?: number;
    behindProxy?: boolean;
    rootPath: string;
    index?: {
        url: string;
        path: string;
    };
    assets?: {
        url: string;
        path: string;
    };
    favicon?: {
        url: string;
        path: string;
    };
}
export declare const DEFAULT_OPTIONS: ServerOptions;
