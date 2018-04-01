'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _caminte = require('caminte');

var _caminte2 = _interopRequireDefault(_caminte);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Configures a property of type string
 * At this moment in the pipeline, this module knows the property
 * coming in should be set as a Boolean type in the model unlike
 * the type require, unique and index that check if they are set
 * on the property definition or not.
 *
 * @param {Object} model The model object being created
 * @param {Object} property The current property object
 * @param {Object} definition The complete user definition for this model
 * @returns {Object} The updated model object
 */
const Boolean = (model, property, definition) => {
    if (!model.properties[property.name]) {
        model.properties[property.name] = {};
    }
    model.properties[property.name].type = _caminte2.default.Schema.Boolean;
    model.validations.push({
        /* eslint-disable require-jsdoc */
        validate: [function (err) {
            if (this[property.name] && typeof this[property.name] !== 'boolean') {
                err();
            }
        }]
    });

    return model;
};

exports.default = Boolean;