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
    behindProxy?: boolean;
}
