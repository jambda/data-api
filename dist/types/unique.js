'use strict';

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
    if (property.unique) {
        if (!model.properties[property.name]) {
            model.properties[property.name] = {};
        }
        model.properties[property.name].unique = true;

        if (typeof property.unique === 'boolean') {
            model.validations.push({
                validatesUniquenessOf: [property.name, { message: `${property.name} already exists` }]
            });
        }

        if (typeof property.unique === 'object') {
            model.validations.push({
                validatesUniquenessOf: [property.name, {
                    message: property.unique.message || `${property.name} already exists`
                }]
            });
        }

        if (property.index === true) {
            model.properties[property.name].index = property.index;
            model.validations.push({
                validatesUniquenessOf: [property.name, {
                    message: property.unique.message || `${property.name} already exists`
                }]
            });
        }
    }

    return model;
};