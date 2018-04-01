'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerRoutes = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _caminte = require('caminte');

var _caminte2 = _interopRequireDefault(_caminte);

var _loader = require('./loader');

var _loader2 = _interopRequireDefault(_loader);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _util = require('./helper/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _caminte2.default.Schema;

/**
 * Check if configuration for the current environment exists
 *
 * @param {Object} config The config object
 * @returns {Object} The environment specific configuration object
 */
const checkEnvironment = config => {
    if (!config.hasOwnProperty(process.env.NODE_ENV)) {
        throw new Error(`Could not find a database configuration block for environment: ${process.env.NODE_ENV}`);
    }
    return config[process.env.NODE_ENV];
};

/**
 * Constructor the returns a function to get|create a schema connection
 *
 * @param {Object} app The application object
 * @returns {function(Object:config):schema.Schema} A function
 */
const createConnection = app => config => app.schema || new Schema(config.driver, config);

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
schema => (0, _loader2.default)(schema, config.modelsPath);

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
    (0, _values2.default)((0, _keys2.default)(models)).map(model => {
        app.use(`${config.prefix ? `/${config.prefix}` : ''}/${models[model].modelName}`, (0, _actions2.default)(models[model]));
    });
    return app;
};

/**
 * Connects to the database
 *
 * @param {object} app The app object
 * @param {object} config The config object
 * @returns {schema.Schema} The schema instance
 */
const registerRoutes = exports.registerRoutes = (app, config) => (0, _util.pipe)(checkEnvironment, createConnection(app), schema => {
    app.schema = schema;
    return schema;
}, loadModels(config), createRoutes(app, config))(config);