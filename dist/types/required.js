"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Configures a property of type string
 *
 * @param {Object} model The model object being created
 * @param {Object} property The current property object
 * @param {Object} definition The complete user definition for this model
 * @returns {Object} The updated model object
 */
exports.default = (model, property, definition) => {
    if (property.required === true) {
        model.validations.push({
            validatesPresenceOf: [property.name]
        });
    }

    return model;
};