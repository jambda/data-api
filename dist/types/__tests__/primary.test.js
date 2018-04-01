'use strict';

var _caminte = require('caminte');

var _caminte2 = _interopRequireDefault(_caminte);

var _util = require('../../helper/util');

var _primary = require('../primary');

var _primary2 = _interopRequireDefault(_primary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const modelMock = {
    properties: {},
    settings: {
        primaryKeys: [],
        indexes: {}
    },
    validations: [],
    relations: []
};
const propertyMock = {
    name: 'testProperty',
    type: _caminte2.default.Schema.Number,
    primary: true
};
const indexes = {};
const definitionMock = {};

describe('Data Type: Primary Keys', () => {
    const model = (0, _util.clone)(modelMock);
    const property = (0, _util.clone)(propertyMock);
    const definition = (0, _util.clone)(definitionMock);
    const response = (0, _util.clone)(model, {
        settings: {
            indexes: expect.anything(),
            primaryKeys: ['testProperty']
        }
    });
    const call = (0, _primary2.default)(model, property, definition);

    it('Should add primary keys & indexes to object settings', () => {
        expect(call).toMatchObject(response);
    });
});