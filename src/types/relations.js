'use strict'

/**
 * Configures a property of type string
 *
 * @param {Object} model The model object being created
 * @param {Object} property The current property object
 * @param {Object} definition The complete user definition for this model
 * @returns {Object} The updated model object
 */
export default (model, property, definition) => {
    if (property.type === 'hasMany' || property.type === 'belongsTo') {
        model.relations.push([
            property.type,
            property.target,
            {
                as: property.name,
                foreignKey:
                    property.type === 'hasMany'
                        ? `${model.name}Id`
                        : `${property.target}Id`
            }
        ])
    }

    return model
}
