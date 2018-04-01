'use strict';

var _util = require('../../helper/util');

var _required = require('../required');

var _required2 = _interopRequireDefault(_required);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const modelMock = {
    properties: {},
    validations: [],
    relations: []
};
const propertyMock = {
    name: 'testProperty',
    type: 'string',
    required: true
};
const definitionMock = {};

describe('Data Type: Required', () => {
    const model = (0, _util.clone)(modelMock);
    const property = (0, _util.clone)(propertyMock);
    const definition = (0, _util.clone)(definitionMock);
    const response = (0, _util.clone)(model, {
        validations: [{
            validatesPresenceOf: ['testProperty']
        }]
    });
    const call = (0, _required2.default)(model, property, definition);

    it('Should add validatesPresenceOf to model validations', () => {
        expect(call).toMatchObject(response);
        expect(call.validations).toHaveLength(1);
    });
});