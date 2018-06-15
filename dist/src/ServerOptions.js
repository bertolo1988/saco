"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
exports.DEFAULT_OPTIONS = {
    name: 'saco-server-1',
    port: 4200,
    ip: 'localhost',
    cors: false,
    dateformat: 'GMT:HH:MM:ss dd-mmm-yy Z',
    verbose: false,
    workers: os.cpus().length,
    maxAge: 43200000,
    behindProxy: false,
    rootPath: path.resolve(__dirname),
    index: { url: '/*', path: 'index.html' },
    assets: { url: '/', path: '/' }
};
//# sourceMappingURL=ServerOptions.js.map