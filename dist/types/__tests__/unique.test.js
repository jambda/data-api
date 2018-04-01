'use strict';

var _util = require('../../helper/util');

var _unique = require('../unique');

var _unique2 = _interopRequireDefault(_unique);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const modelMock = {
    properties: {},
    validations: [],
    relations: []
};
const propertyMock = {
    name: 'testProperty',
    type: 'string',
    unique: true
};
const definitionMock = {};

describe('Data Type: Unique', () => {
    const model = (0, _util.clone)(modelMock);
    const property = (0, _util.clone)(propertyMock);
    const definition = (0, _util.clone)(definitionMock);
    const response = (0, _util.clone)(model, {
        validations: [{
            validatesUniquenessOf: ['testProperty', { message: expect.anything() }]
        }]
    });
    const call = (0, _unique2.default)(model, property, definition);

    it('Should add validatesPresenceOf to model validations', () => {
        expect(call).toMatchObject(response);
        expect(call.validations).toHaveLength(1);
    });
});