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

var _index = require('./../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = _yamljs2.default.parse(String(_fs2.default.readFileSync('src/__mocks__/config.yml')));
const app = {
    router: {}
};
const entity = 'user';
const filterStack = (entity, path) => app.router[`/${entity}`].stack.filter(layer => layer.route.path === path)[0].route;

app.use = jest.fn((path, router) => {
    app.router[path] = router;
});

describe('Entity Builder', () => {
    beforeAll((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
                case 0:
                    return _context.abrupt('return', (0, _index.registerRoutes)(app, config.database));

                case 1:
                case 'end':
                    return _context.stop();
            }
        }, _callee, undefined);
    })));

    it('Should add one route per model to the app instance', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var paths;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
                case 0:
                    paths = (0, _keys2.default)(app.router);

                    expect((0, _keys2.default)(app.router)).toHaveLength(2);
                    expect(paths).toMatchObject(['/post', '/user']);

                case 3:
                case 'end':
                    return _context2.stop();
            }
        }, _callee2, undefined);
    })));

    it('Should add each model to the Schema object', () => {
        expect((0, _keys2.default)(app.schema.models)).toHaveLength(2);
        expect(app.schema.models[entity].modelName).toEqual(entity);
    });

    it('Should add correct properties to model', () => {
        expect((0, _keys2.default)(app.schema.definitions[entity].properties).sort()).toMatchObject(['active', 'validated', 'name', 'username', 'email', 'password', 'created', 'id'].sort());
    });

    it('Should add relations', () => {
        expect((0, _keys2.default)(app.schema.models['user'].relations)).toContain('posts');
        expect((0, _keys2.default)(app.schema.models['post'].relations)).toContain('user');
    });

    it('Should have created GET & POST routes', () => {
        expect(filterStack(entity, '/').methods).toMatchObject({
            get: true,
            post: true
        });
    });

    it('Should have created PUT, PATCH & DELETE routes', () => {
        expect(filterStack(entity, '/:id').methods).toMatchObject({
            put: true,
            patch: true,
            delete: true
        });
    });

    it('Should have created COUNT route', () => {
        expect(filterStack(entity, '/count').methods).toMatchObject({
            get: true
        });
    });

    it('Should have created NEW route', () => {
        expect(filterStack(entity, '/new').methods).toMatchObject({
            post: true
        });
    });
});