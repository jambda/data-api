'use strict';

var _util = require('../../helper/util');

var _relations = require('../relations');

var _relations2 = _interopRequireDefault(_relations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const modelMock = {
    properties: {},
    validations: [],
    relations: []
};

const propertyMock = {
    name: 'testProperty',
    type: 'hasMany',
    target: 'entity'
};

const definitionMock = {};

describe('Data Type: Relations', () => {
    it('Should add a hasMany relation to the model', () => {
        const model = (0, _util.clone)(modelMock);
        const property = (0, _util.clone)(propertyMock);
        const definition = (0, _util.clone)(definitionMock);
        const call = (0, _relations2.default)(model, property, definition);
        const response = (0, _util.clone)(model, {
            relations: [['hasMany', property.target, {
                as: property.name,
                foreignKey: `${model.name}Id`
            }]]
        });

        expect(call).toMatchObject(response);
    });

    it('Should add a belongsTo relation to the model', () => {
        const model = (0, _util.clone)(modelMock);
        const property = (0, _util.clone)(propertyMock, { type: 'belongsTo' });
        const definition = (0, _util.clone)(definitionMock);
        const call = (0, _relations2.default)(model, property, definition);
        const response = (0, _util.clone)(model, {
            relations: [['belongsTo', property.target, {
                as: property.name,
                foreignKey: `${property.target}Id`
            }]]
        });

        expect(call).toMatchObject(response);
    });
});