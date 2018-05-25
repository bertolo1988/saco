process.env.NODE_ENV = 'test';

import * as os from 'os';
import * as path from 'path';
import { ServerOptions } from '../src/ServerOptions';
import { Server } from '../src/Server';

let chai = require('chai');
var expect = chai.expect;
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const angularCliDemoPath = path.join(__dirname, '../../examples/angular-cli');
const TESTS_PORT = 3028;

describe('testing basic CRUD operations', () => {
    it('test options construction', done => {
        let options: ServerOptions = { name: 'randomName', rootPath: angularCliDemoPath, port: TESTS_PORT, workers: 999, maxAge: 90 };
        let server: Server = new Server(options);
        expect(server.options.name).to.be.a('string').and.equal('randomName');
        expect(server.options.port).to.be.a('number').and.equal(TESTS_PORT);
        expect(server.options.dateformat).to.be.a('string').and.equal('GMT:HH:MM:ss dd-mmm-yy Z');
        expect(server.options.verbose).to.be.a('boolean').and.equal(false);
        expect(server.options.workers).to.be.a('number').and.equal(os.cpus().length);
        expect(server.options.maxAge).to.be.a('number').and.equal(90);
        expect(server.options.rootPath).to.be.a('string').and.equal(angularCliDemoPath);
        expect(server.options.index.path).to.be.a('string').and.equal('index.html');
        expect(server.options.index.url).to.be.a('string').and.equal('/*');
        expect(server.options.assets.url).to.be.a('string').and.equal('/');
        expect(server.options.assets.path).to.be.a('string').and.equal('/');
        done();
    });

    it('test default options', (done) => {
        let options: ServerOptions = { rootPath: 'dist' };
        let server: Server = new Server(options);
        expect(server.options.name).to.be.a('string').and.equal('saco-server-1');
        expect(server.options.port).to.be.a('number').and.equal(4200);
        expect(server.options.dateformat).to.be.a('string').and.equal('GMT:HH:MM:ss dd-mmm-yy Z');
        expect(server.options.verbose).to.be.a('boolean').and.equal(false);
        expect(server.options.workers).to.be.a('number').and.equal(os.cpus().length);
        expect(server.options.rootPath).to.be.a('string').and.equal('dist');
        expect(server.options.index.path).to.be.a('string').and.equal('index.html');
        expect(server.options.index.url).to.be.a('string').and.equal('/*');
        expect(server.options.assets.url).to.be.a('string').and.equal('/');
        expect(server.options.assets.path).to.be.a('string').and.equal('/');
        done();
    });

});