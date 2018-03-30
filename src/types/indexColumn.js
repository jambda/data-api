/**
 * Configures a property of type string
 *
 * @param {Object} model The model object being created
 * @param {Object} property The current property object
 * @param {Object} definition The complete user definition for this model
 * @returns {Object} The updated model object
 */
export default (model, property, definition) => {
    if (property.hasOwnProperty('index')) {
        if (!model.properties[property.name]) {
            model.properties[property.name] = {}
        }
        model.properties[property.name].index = true

        model.validations.push({
            validatesUniquenessOf: [property.name]
        })
    }

    return model
}