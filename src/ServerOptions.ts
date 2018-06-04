import * as os from 'os';
import * as path from 'path';
export interface ServerOptions {
  name?: string;
  port?: number;
  cors?: boolean;
  dateformat?: string;
  verbose?: boolean;
  key?: string;
  cert?: string;
  workers?: number;
  maxAge?: number;
  behindProxy?: boolean;
  rootPath: string;
  index?: { url: string|Array<string>; path: string };
  assets?: { url: string; path: string };
  favicon?: { url: string; path: string };
}

export const DEFAULT_OPTIONS: ServerOptions = {
  name: 'saco-server-1',
  port: 4200,
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
