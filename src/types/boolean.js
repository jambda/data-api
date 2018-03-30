import caminte from 'caminte'

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
        model.properties[property.name] = {}
    }
    model.properties[property.name].type = caminte.Schema.Boolean
    model.validations.push({
        /* eslint-disable require-jsdoc */
        validate: [
            function(err) {
                if (
                    this[property.name] &&
                    typeof this[property.name] !== 'boolean'
                ) {
                    err()
                }
            }
        ]
    })

    return model
}

export default Boolean
