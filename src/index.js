import caminte from 'caminte'
import loader from './loader'
import createRoute from './actions'
import { pipe } from './helper/util'

const Schema = caminte.Schema

/**
 * Check if configuration for the current environment exists
 *
 * @param {Object} config The config object
 * @returns {Object} The environment specific configuration object
 */
const checkEnvironment = config => {
    if (!config.hasOwnProperty(process.env.NODE_ENV)) {
        throw new Error(
            `Could not find a database configuration block for environment: ${
                process.env.NODE_ENV
            }`
        )
    }
    return config[process.env.NODE_ENV]
}

/**
 * Constructor the returns a function to get|create a schema connection
 *
 * @param {Object} app The application object
 * @returns {function(Object:config):schema.Schema} A function
 */
const createConnection = app => config =>
    app.schema || new Schema(config.driver, config)

/**
 * loadModels constructor
 *
 * @param {object} config The config object
 * @returns {Function} loadModels function
 */
const loadModels = config =>
    /**
     * Loads models from modelsPath in the configuration file
     *
     * @param {Object} schema The schema object
     * @returns {Object} The loaded schema
     */
    schema => loader(schema, config.modelsPath)

/**
 * createRoutes constructor
 *
 * @param {object} app The express app
 * @param {object} config The config object
 * @returns {Function} createRoutes
 */
const createRoutes = (app, config) =>
    /**
     * Create routes for each available model
     *
     * @param {Object} models The created models
     * @returns {Object[]} The array of
     */
    models => {
        Object.values(Object.keys(models)).map(model => {
            app.use(
                `${config.prefix ? `/${config.prefix}` : ''}/${
                    models[model].modelName
                }`,
                createRoute(models[model])
            )
        })
        return app
    }

/**
 * Connects to the database
 *
 * @param {object} app The app object
 * @param {object} config The config object
 * @returns {schema.Schema} The schema instance
 */
export const registerRoutes = (app, config) =>
    pipe(
        checkEnvironment,
        createConnection(app),
        schema => {
            app.schema = schema
            return schema
        },
        loadModels(config),
        createRoutes(app, config)
    )(config)
