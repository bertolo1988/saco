"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
const os = require("os");
const path = require("path");
const ServerOptions_1 = require("../src/ServerOptions");
const Server_1 = require("../src/Server");
let chai = require('chai');
var expect = chai.expect;
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const angularCliDemoPath = path.join(__dirname, '../../examples/angular-cli');
const TESTS_PORT = 3028;
describe('testing basic CRUD operations', () => {
    it('test options construction', done => {
        let options = { name: 'randomName', rootPath: angularCliDemoPath, port: TESTS_PORT, workers: 999, maxAge: 90 };
        let server = new Server_1.Server(options);
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
        let options = { rootPath: 'dist' };
        let server = new Server_1.Server(options);
        expect(server.options.name).to.be.a('string').and.equal(ServerOptions_1.DEFAULT_OPTIONS.name);
        expect(server.options.port).to.be.a('number').and.equal(ServerOptions_1.DEFAULT_OPTIONS.port);
        expect(server.options.dateformat).to.be.a('string').and.equal(ServerOptions_1.DEFAULT_OPTIONS.dateformat);
        expect(server.options.verbose).to.be.a('boolean').and.equal(ServerOptions_1.DEFAULT_OPTIONS.verbose);
        expect(server.options.workers).to.be.a('number').and.equal(os.cpus().length);
        expect(server.options.rootPath).to.be.a('string').and.equal('dist');
        expect(server.options.index.path).to.be.a('string').and.equal(ServerOptions_1.DEFAULT_OPTIONS.index.path);
        expect(server.options.index.url).to.be.a('string').and.equal(ServerOptions_1.DEFAULT_OPTIONS.index.url);
        expect(server.options.assets.path).to.be.a('string').and.equal(ServerOptions_1.DEFAULT_OPTIONS.assets.path);
        expect(server.options.assets.url).to.be.a('string').and.equal(ServerOptions_1.DEFAULT_OPTIONS.assets.url);
        done();
    });
});
//# sourceMappingURL=Tests.js.map