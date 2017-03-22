process.env.NODE_ENV = 'test';

import * as Saco from '../src/Server';
import * as path from 'path';

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();

chai.use(chaiHttp);

const angularCliDemoPath = path.join(__dirname, '../../examples/angular-cli');
const vueCliDemoPath = path.join(__dirname, '../../examples/webpack-vue-cli');
const TESTS_PORT = 3028;

describe('testing basic CRUD operations', () => {

    it('should launch angular-cli example', (done) => {
        let options: Saco.ServerOptions = { folder: angularCliDemoPath, port: TESTS_PORT };
        let server: Saco.Server = new Saco.Server(options);
        server.start().then(() => {
            chai.request('localhost:' + options.port).get('/').then(res => {
                res.should.have.status(200);
                server.stop().then(() => {
                    done();
                });
            });
        });
    });

    it('should launch webpack-vue-cli example', (done) => {
        let options: Saco.ServerOptions = { folder: vueCliDemoPath, port: TESTS_PORT };
        let server: Saco.Server = new Saco.Server(options);
        server.start().then(() => {
            chai.request('localhost:' + options.port).get('/').then(res => {
                res.should.have.status(200);
                server.stop().then(() => {
                    done();
                });
            });
        });
    });

});