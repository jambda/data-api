import caminte from 'caminte'

/**
 * Configures a property of type string
 *
 * @param {Object} model The model object being created
 * @param {Object} property The current property object
 * @param {Object} definition The complete user definition for this model
 * @returns {Object} The updated model object
 */
export default (model, property, definition) => {
    if (!model.properties[property.name]) {
        model.properties[property.name] = {}
    }
    model.properties[property.name].type = caminte.Schema.Date
    model.validations.push({
        /* eslint-disable require-jsdoc */
        validate: [
            function(err) {
                if (!(this[property.name] instanceof Date)) err()
            }
        ]
    })

    return model
}
