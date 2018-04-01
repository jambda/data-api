'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _yamljs = require('yamljs');

var _yamljs2 = _interopRequireDefault(_yamljs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _error = require('./../__mocks__/error');

var _error2 = _interopRequireDefault(_error);

var _util = require('./../helper/util');

var _user = require('./../__mocks__/data/user.json');

var _user2 = _interopRequireDefault(_user);

var _posts = require('./../__mocks__/data/posts.json');

var _posts2 = _interopRequireDefault(_posts);

var _index = require('./../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = _yamljs2.default.parse(String(_fs2.default.readFileSync('src/__mocks__/config.yml')));
const application = (0, _express2.default)();
application.use(_bodyParser2.default.json());
application.use(_bodyParser2.default.urlencoded({ extended: true }));

let id, record;

describe('Resource Routes:', function () {
    var _this = this;

    beforeAll((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return (0, _index.registerRoutes)(application, config.database);

                case 2:
                    return _context.abrupt('return', application.use(_error2.default));

                case 3:
                case 'end':
                    return _context.stop();
            }
        }, _callee, _this);
    })));

    it('should get a new resource', function (done) {
        const testUser = (0, _util.clone)(_user2.default);
        (0, _supertest2.default)(application).post('/user/new').send(testUser).set('Accept', 'application/json').expect(200).then(res => {
            expect((0, _keys2.default)(res.body).sort()).toMatchObject((0, _keys2.default)(testUser).sort());
            record = res.body;
            done();
        }).catch(done);
    });

    it('should create a new resource', function (done) {
        const testUser = (0, _util.clone)(_user2.default);
        (0, _supertest2.default)(application).post('/user').send(testUser).set('Accept', 'application/json').expect(200).then(res => {
            testUser.id = res.body.id;
            expect(res.body).toMatchObject(testUser);

            id = res.body.id;
            record = res.body;

            _posts2.default.forEach(post => {
                post.userId = id;
            });
            done();
        }).catch(done);
    });

    it('should create resources by bulk', function (done) {
        (0, _supertest2.default)(application).post('/post/bulk').send(_posts2.default).set('Accept', 'application/json').expect(200).then(res => {
            expect(res.body).toHaveLength(5);
            const response = _posts2.default.map(post => {
                post.id = expect.anything();
                return post;
            });
            expect(res.body).toMatchObject(response);
            done();
        }).catch(done);
    });

    it('should not allow duplicated data (email, username)', function (done) {
        const duplicatedData = (0, _util.clone)(record);
        delete duplicatedData.id;

        (0, _supertest2.default)(application).post('/user').send(duplicatedData).set('Accept', 'application/json').expect(422).then(res => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toEqual('Unprocessable Entity');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('email');
            expect(res.body.data).toHaveProperty('username');

            done();
        }).catch(done);
    });

    it('should list all resources', function (done) {
        (0, _supertest2.default)(application).get('/user').set('Accept', 'application/json').expect(200).then(res => {
            expect(res.body.length).toBeGreaterThan(0);
            done();
        }).catch(done);
    });

    it('should count all resources', function (done) {
        (0, _supertest2.default)(application).get('/user/count').set('Accept', 'application/json').expect(200).then(res => {
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty('count');
            expect(res.body.count).toBeGreaterThan(0);

            done();
        }).catch(done);
    });

    it('should get a single resource', function (done) {
        (0, _supertest2.default)(application).get('/user/' + id).set('Accept', 'application/json').expect(200).then(res => {
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty('id');

            record = res.body;
            done();
        }).catch(done);
    });

    it('should get all posts by userId', function (done) {
        (0, _supertest2.default)(application).get('/post').send({ userId: id }).set('Accept', 'application/json').expect(200).then(res => {
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveLength(5);

            done();
        }).catch(done);
    });

    it('should patch a resource', function (done) {
        const NEW_TITLE = 'User Name Updated';

        (0, _supertest2.default)(application).patch('/user/' + id).set('Accept', 'application/json').send({ name: NEW_TITLE }).expect(200).then(res => {
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name');
            expect(res.body.name).toEqual(NEW_TITLE);

            done();
        }).catch(done);
    });

    it('should put a resource', function (done) {
        const putUserData = (0, _util.clone)(record, {
            name: 'Put Test'
        });
        delete putUserData.id;

        (0, _supertest2.default)(application).put('/user/' + id).set('Accept', 'application/json').send(putUserData).expect(200).then(res => {
            putUserData.id = res.body.id;
            expect(res.body).toMatchObject(putUserData);
            done();
        }).catch(done);
    });

    it('should delete a resource', function (done) {
        (0, _supertest2.default)(application).delete('/user/' + id).set('Accept', 'application/json').expect(204).then(res => {
            expect(res.body).toEqual({});

            done();
        }).catch(done);
    });
});