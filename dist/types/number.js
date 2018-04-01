'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _caminte = require('caminte');

var _caminte2 = _interopRequireDefault(_caminte);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Configures a property of type string
 *
 * @param {Object} model The model object being created
 * @param {Object} property The current property object
 * @param {Object} definition The complete user definition for this model
 * @returns {Object} The updated model object
 */
exports.default = (model, property, definition) => {
    if (!model.properties[property.name]) {
        model.properties[property.name] = {};
    }
    model.properties[property.name].type = _caminte2.default.Schema.Number;
    model.validations.push({
        /* eslint-disable require-jsdoc */
        validate: [function (err) {
            if (typeof this[property.name] !== 'number') err();
        }]
    });

    return model;
};