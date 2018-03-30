import fs from 'fs'
import path from 'path'
import YAML from 'yamljs'
import { pipe } from './helper/util'
import type from './types'

/**
 * Ensures the cirectory where to save the file exists
 *
 * @param {string} directory The directory where to save the collection file
 * @returns {*} The local directory path
 */
const ensureDirectoryExists = (directory = null) => {
    const localPath = path.join(fs.realpathSync('./'), directory)

    if (!fs.existsSync(localPath)) {
        throw new Error(`Provided directory ${localPath} foes not exists!`)
    }

    return localPath
}

/**
 * Loads a single file from the file system
 *
 * @param {String} localPath A file path
 * @returns {Object} The converted object from the yml file
 */
const loadFile = localPath => {
    try {
        return YAML.parse(String(fs.readFileSync(localPath)))
    } catch (error) {
        throw new Error(
            `Could not load yml file at ${localPath}, ${error.message}`
        )
    }
}

/**
 * Loads the available yml models
 *
 * @param {String} directory The directory path
 * @returns {Object[]} The files object
 */
const load = directory => {
    const files = fs.readdirSync(directory)
    return files.map(file => {
        return loadFile(path.join(directory, file))
    })
}

/**
 * Transpiles yml files into ORM model configurations
 *
 * @param {Object[]} definitions The definitions array
 * @returns {Object[]} The mapped model definitions
 */
const transpile = definitions =>
    definitions.map(definition => {
        const { properties, indexes } = definition
        const model = {
            name: definition.name,
            properties: {},
            settings: {
                primaryKeys: [],
                indexes: {}
            },
            validations: [],
            relations: []
        }

        Object.keys(properties).map(property => {
            const prop = properties[property]
            prop.name = property
            type.primary(model, prop, definition)
            type.unique(model, prop, definition)
            type.index(model, prop, definition)
            type.required(model, prop, definition)
            type[prop.type.toLowerCase()](model, prop, definition)
        })

        model.settings.indexes = indexes

        return model
    })

/**
 * apply constructor
 *
 * @param {Object} schema The schema object
 * @returns {Function} The applyProperties function
 */
const applyProperties = schema =>
    /**
     * Apply's the model to the current ORM
     *
     * @param {Object[]} models The models definitions array
     * @returns {Object[]} The models instances
     */
    models => {
        models.map(model => {
            model.relations.map(relation => {
                const [type, target, options] = relation

                if (type === 'belongsTo') {
                    const key = `${target}Id`
                    model.properties[key] = {
                        type: 'Number'
                    }
                    options.foreignKey = key
                }

                if (type === 'hasMany') {
                    options.foreignKey = `${model.name}Id`
                }
            })

            const instance = schema.define(
                model.name,
                model.properties,
                model.settings
            )

            model.validations.map(validation => {
                Object.keys(validation).map(key => {
                    if (!instance.hasOwnProperty(key)) {
                        throw new Error(
                            `Validation ${key} for ${
                                model.modelName
                            } does not exist!`
                        )
                    }
                    instance[key].apply(instance, validation[key])
                })
            })
        })
        return models
    }

/**
 * apply constructor
 *
 * @param {Object} schema The schema object
 * @returns {Function} The applyRelations function
 */
const applyRelations = schema =>
    /**
     * Apply's the model to the current ORM
     *
     * @param {Object[]} models The models definitions array
     * @returns {Object} The schema instance
     */
    models => {
        models.map(model => {
            model.relations.map(relation => {
                const [type, target, options] = relation

                if (!schema.models.hasOwnProperty(model.name)) {
                    throw new Error(
                        `Model ${model.name} set on relation ${type} for ${
                            model.name
                        } does not exist!`
                    )
                }

                if (!schema.models.hasOwnProperty(target)) {
                    throw new Error(
                        `Model ${target} set on relation ${type} for ${
                            model.name
                        } does not exist!`
                    )
                }

                if (type === 'belongsTo') {
                    schema.models[model.name].belongsTo(
                        schema.models[target],
                        options
                    )
                }

                if (type === 'hasMany') {
                    schema.models[model.name].hasMany(
                        schema.models[target],
                        options
                    )
                }
            })
        })

        return schema
    }

/**
 * Loads yml model config files into the ORM
 *
 * @param {Object} schema The schema object
 * @param {String} directory The directory path where to fine the config files
 * @returns {Object[]} The modles instances array
 */
export default (schema, directory) =>
    pipe(
        ensureDirectoryExists,
        load,
        transpile,
        applyProperties(schema),
        applyRelations(schema)
    )(directory)
