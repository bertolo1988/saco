import { ServerOptions, DEFAULT_OPTIONS } from './ServerOptions';
import { Request, Response, Application } from 'express';
import * as Http from 'http';
import * as Https from 'https';
import * as express from 'express';
import * as debug from 'debug';
import * as compression from 'compression';
import * as path from 'path';
import * as datefmt from 'dateformat';
import * as favicon from 'serve-favicon';
import * as fs from 'fs';
import * as cluster from 'cluster';
import * as process from 'process';
import * as os from 'os';

const logError: debug.IDebugger = debug('saco:error');
const logInfo: debug.IDebugger = debug('saco:info');

enum ClusterMessage {
  WORKER_LISTENING
}

export class Server {
  startedWorkersCount: number = 0;
  app: Application = express();
  server: Http.Server | Https.Server;
  options: ServerOptions;

  constructor(options: ServerOptions) {
    this.options = (<any>Object).assign({}, DEFAULT_OPTIONS, options);
    this.options.workers = Math.min(
      Math.max(this.options.workers, 1),
      os.cpus().length
    );
    this.appConfigure();
  }

  private isHttps(): boolean {
    return this.options.key != null && this.options.cert != null;
  }

  private setMaxSockets() {
    if (this.isHttps()) {
      Https.globalAgent.maxSockets = Infinity;
      logInfo('Https max sockets set to %O', Https.globalAgent.maxSockets);
    } else {
      Http.globalAgent.maxSockets = Infinity;
      logInfo('Http max sockets set to %O', Http.globalAgent.maxSockets);
    }
  }

  private appConfigure() {
    this.app.use(compression());
    if (this.options.behindProxy) {
      this.app.enable('trust proxy');
    }
    if (this.options.verbose) {
      this.app.use((req: Request, res: Response, next: Function) => {
        logInfo(
          this.options.name,
          datefmt(new Date(), this.options.dateformat),
          'pid:',
          process.pid,
          'ip:',
          req.ip,
          '\t',
          req.method,
          '\t',
          req.url
        );
        next();
      });
    }
    this.app.use(
      this.options.assets.url,
      express.static(
        path.join(this.options.rootPath, this.options.assets.path),
        { maxAge: this.options.maxAge }
      )
    );
    this.app.get(this.options.index.url, (req, res) => {
      res.sendFile(path.join(this.options.rootPath, this.options.index.path));
    });
    this.app.use((err: Error, req: Request, res: Response, next: Function) => {
      logError(
        datefmt(new Date(), this.options.dateformat),
        '\t:',
        req.method,
        req.url
      );
      logError(err.stack);
      res.status(500).send('Something broke!');
    });
    if (this.options.favicon != null) {
      this.app.use(
        this.options.favicon.url,
        favicon(path.join(this.options.rootPath, this.options.favicon.path))
      );
    }
  }

  private createServer(): Https.Server | Http.Server {
    if (this.isHttps()) {
      logInfo('Starting https server on worker %O...', process.pid);
      let httpsOptions = {
        key: fs.readFileSync(this.options.key),
        cert: fs.readFileSync(this.options.cert)
      };
      return Https.createServer(httpsOptions, this.app);
    } else {
      logInfo('Starting http server on worker %O...', process.pid);
      return Http.createServer(this.app);
    }
  }

  private startMaster(): Promise<number> {
    var self = this;
    return new Promise((resolve, reject) => {
      for (let i = 0; i < self.options.workers; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        logInfo(`Worker %O died`, worker.process.pid);
        self.startedWorkersCount--;
        if (self.startedWorkersCount === 0) {
          logInfo('Bye');
        }
      });
      cluster.on('message', (worker, data) => {
        logInfo('Process %O listening on port %O', data.pid, self.options.port);
        self.startedWorkersCount++;
        if (self.startedWorkersCount === self.options.workers) {
          logInfo('Server ready');
          resolve(self.startedWorkersCount);
        }
      });
      cluster.on('online', worker => {
        logInfo('Process %O just went online', worker.process.pid);
      });
    });
  }

  private sendMaster(pid: number, msg: ClusterMessage) {
    process.send({ pid, msg });
  }

  private startWorker(): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      self.server = self.createServer();
      self.server
        .listen(self.options.port, () => {
          self.sendMaster(process.pid, ClusterMessage.WORKER_LISTENING);
          resolve();
        })
        .on('error', () => {
          logError('Failed to start the server on port %O', self.options.port);
          reject();
        });
    });
  }

  // returnes a promise that resolves only after all workers
  // have sent ClusterMessage.WORKER_LISTENING to the master
  start(): Promise<number> {
    var self = this;
    return new Promise((resolve, reject) => {
      if (cluster.isMaster) {
        logInfo(`Starting %O master %O...`, this.options.name, process.pid);
        logInfo('Options: %O', self.options);
        self.setMaxSockets();
        resolve(self.startMaster());
      } else {
        logInfo(`Starting %O worker %O...`, this.options.name, process.pid);
        self.startWorker();
      }
    });
  }

  // returnes a promise that resolves only after all
  // workers have send 'exit' event to the master
  stop(): Promise<any> {
    return new Promise((resolve, reject) => {
      cluster.disconnect(() => {
        resolve();
      });
    });
  }
}
