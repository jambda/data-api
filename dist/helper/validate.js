'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _boom = require('boom');

/**
 * Helper function to set the error response for invalid models
 *
 * @param {Schema} model The model to validate
 * @param {Function} reject The reject callback function
 * @param {Function} callback The success callback
 * @returns {void}
 */
const validate = (model, reject, callback) => {
    model.isValid(isValid => {
        if (!isValid) {
            return reject((0, _boom.badData)('Invalid data provided, please verify and try again!', model.errors));
        }

        callback(model);
    });
};

exports.default = validate;