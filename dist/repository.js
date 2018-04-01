'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.truncate = exports.destroy = exports.createBulk = exports.create = exports.put = exports.patch = exports.get = exports.empty = exports.count = exports.list = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('async/map');

var _map2 = _interopRequireDefault(_map);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _validate = require('./helper/validate');

var _validate2 = _interopRequireDefault(_validate);

var _util = require('./helper/util');

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * LIST records from a database
 *
 * @param {Schema} model The current model
 * @returns {function(Object): T} The list function
 */
const list = exports.list = model => params => {
    return new _promise2.default((resolve, reject) => {
        let query = params;
        let skip = query.skip ? parseInt(query.skip) - 1 : 0;
        let limit = query.limit ? parseInt(query.limit) : 20;

        let opts = {
            skip: skip,
            limit: limit,
            where: {}
        };

        delete query.skip;
        delete query.limit;

        // TODO: it needs implementation for search
        opts.where = (0, _util.clone)(opts.where, query);

        model.all(opts, (err, users) => {
            if (err) {
                return reject(err);
            }

            return resolve(users);
        });
    });
};

/**
 * COUNT records from a database
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The query promise
 */
const count = exports.count = model => query => {
    return new _promise2.default((resolve, reject) => {
        let opts = {
            where: {}

            // TODO: it needs implementation
        };opts.where = (0, _util.clone)(opts.where, query);

        model.count(opts.where, (err, count) => {
            if (err) {
                return reject(err);
            }
            return resolve({ count: count });
        });
    });
};

/**
 * GET an EMPTY record from the schema manager
 *
 * @param {Schema} model The current model
 * @returns {function(Object)} The empty function
 */
const empty = exports.empty = model => params => {
    const newResource = new model(params);
    return newResource.toObject();
};

/**
 * GET a record from the database
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The get function
 */
const get = exports.get = model => user_id => {
    return new _promise2.default((resolve, reject) => {
        model.findById(user_id, (err, user) => {
            if (err) {
                return reject(err);
            }

            return resolve(user);
        });
    });
};

/**
 * PATCH a record on the database
 *
 * @param {Schema} model The current model
 * @returns {function(any, Object):Promise} The patch function
 */
const patch = exports.patch = model => (id, payload) => {
    return new _promise2.default((resolve, reject) => {
        get(model)(id).then(user => {
            if (!user) {
                return resolve();
            }

            (0, _assign2.default)(user, payload);

            (0, _validate2.default)(user, reject, user => {
                user.save(err => {
                    if (err) {
                        return reject(err); //reject(boom.badRequest(err.message || err).output.payload)
                    }

                    return resolve(user);
                });
            });
        }).catch(reject);
    });
};

/**
 * PUT a record on the database
 *
 * @param {Schema} model The current model
 * @returns {function(any, Object):Promise} The put function
 */
const put = exports.put = model => (id, payload) => {
    return new _promise2.default((resolve, reject) => {
        get(model)(id).then(found => {
            if (!found) {
                return resolve();
            }

            payload.id = id;
            const resource = new model(payload);

            (0, _validate2.default)(resource, reject, () => {
                resource.save(err => {
                    if (err) {
                        return reject(_boom2.default.badRequest(err.message || err).output.payload); //reject(boom.badRequest(err.message || err).output.payload)
                    }

                    return resolve(resource);
                });
            });
        }).catch(reject);
    });
};

/**
 * CREATE a record on a database
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The create function
 */
const create = exports.create = model => payload => {
    return new _promise2.default((resolve, reject) => {
        let newResource = new model(payload);
        (0, _validate2.default)(newResource, reject, user => {
            user.save(err => {
                if (err) {
                    return reject(_boom2.default.badRequest(err.message || err).output.payload);
                }
                return resolve(newResource.toObject()); //res.status(201);
            });
        });
    });
};

/**
 * CREATE BULK a record on a database
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The create bulk function
 */
const createBulk = exports.createBulk = model => payload => {
    return new _promise2.default((resolve, reject) => {
        const errors = [];
        (0, _map2.default)(payload, (item, callback) => {
            const resource = new model(item);
            (0, _validate2.default)(resource, error => errors.push(error), resource => {
                callback(null, resource);
            });
        }, function (err, models) {
            if (err) {
                return reject(_boom2.default.internal(err.message, err, 500));
            }

            if (errors.length) {
                return reject(_boom2.default.badData('Invalid data provided, please verify and try again!', model.errors));
            }

            (0, _map2.default)(models, (model, callback) => {
                model.save((err, instance) => {
                    if (err) {
                        // @todo Implement transactions instead of this horrendous thing
                        return callback(reject(_boom2.default.internal(err.message, err, 500)));
                    }
                    callback(null, instance.toObject(true));
                });
            }, (err, results) => {
                if (err) reject(err);else resolve(results);
            });
        });
    });
};

/**
 * Delete action, deletes a single user
 * Default mapping to DEL '~/users/:id', no GET mapping
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The destroy function
 */
const destroy = exports.destroy = model => user_id => {
    return new _promise2.default((resolve, reject) => {
        model.findById(user_id, (err, user) => {
            if (err) {
                reject(err);
            }

            if (!user) {
                return resolve();
            }

            model.destroyById(user_id, err => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    });
};

/**
 * Delete action, deletes a all users
 * Default mapping to DEL '~/users', no GET mapping
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The trucate function
 */
const truncate = exports.truncate = model => () => {
    return new _promise2.default((resolve, reject) => {
        model.destroyAll(err => {
            if (err) {
                return reject(_boom2.default.badRequest(err.message || err).output.payload);
            } else {
                resolve();
            }
        });
    });
};