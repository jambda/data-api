'use strict';

var _caminte = require('caminte');

var _caminte2 = _interopRequireDefault(_caminte);

var _util = require('../../helper/util');

var _string = require('../string');

var _string2 = _interopRequireDefault(_string);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const modelMock = {
    properties: {},
    validations: [],
    relations: []
};
const propertyMock = {
    name: 'testProperty',
    type: _caminte2.default.Schema.String
};
const definitionMock = {};

describe('Data Type: String', () => {
    const model = (0, _util.clone)(modelMock);
    const property = (0, _util.clone)(propertyMock);
    const definition = (0, _util.clone)(definitionMock);
    const response = (0, _util.clone)(model, {
        properties: { testProperty: { type: _caminte2.default.Schema.String } },
        validations: expect.anything()
    });
    const call = (0, _string2.default)(model, property, definition);

    it('Should add to properties to model', () => {
        expect(call).toMatchObject(response);
        expect(call.validations).toHaveLength(1);
    });

    it('Should properly validate string type to true', () => {
        const errorCallback = jest.fn(() => {});
        const THIS = { testProperty: 'string' };
        const { validate } = call.validations[0];

        expect(validate[0].call(THIS, errorCallback)).toBeUndefined();
        expect(errorCallback).not.toHaveBeenCalled();
    });

    it('Should properly validate string type to false', () => {
        const errorCallback = jest.fn(() => {});
        const THIS = { testProperty: 56464 };
        const { validate } = call.validations[0];

        expect(validate[0].call(THIS, errorCallback)).toBeUndefined();
        expect(errorCallback).toHaveBeenCalled();
    });
});