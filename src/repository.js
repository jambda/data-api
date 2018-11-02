import map from 'async/map'
import boom from 'boom'
import validate from './helper/validate'
import { clone } from './helper/util'
import assign from 'lodash/assign'

/**
 * LIST records from a database
 *
 * @param {Schema} model The current model
 * @returns {function(Object): T} The list function
 */
export const list = model => params => {
    return new Promise((resolve, reject) => {
        let query = params
        let skip = query.skip ? parseInt(query.skip) - 1 : 0
        let limit = query.limit ? parseInt(query.limit) : 20

        let opts = {
            skip: skip,
            limit: limit,
            where: {}
        }

        delete query.skip
        delete query.limit

        // TODO: it needs implementation for search
        opts.where = clone(opts.where, query)

        model.all(opts, (err, users) => {
            if (err) {
                return reject(err)
            }

            return resolve(users)
        })
    })
}

/**
 * COUNT records from a database
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The query promise
 */
export const count = model => query => {
    return new Promise((resolve, reject) => {
        let opts = {
            where: {}
        }

        // TODO: it needs implementation
        opts.where = clone(opts.where, query)

        model.count(opts.where, (err, count) => {
            if (err) {
                return reject(err)
            }
            return resolve({ count: count })
        })
    })
}

/**
 * GET an EMPTY record from the schema manager
 *
 * @param {Schema} model The current model
 * @returns {function(Object)} The empty function
 */
export const empty = model => params => {
    const newResource = new model(params)
    return newResource.toObject()
}

/**
 * GET a record from the database
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The get function
 */
export const get = model => user_id => {
    return new Promise((resolve, reject) => {
        model.findById(user_id, (err, user) => {
            if (err) {
                return reject(err)
            }

            return resolve(user)
        })
    })
}

/**
 * PATCH a record on the database
 *
 * @param {Schema} model The current model
 * @returns {function(any, Object):Promise} The patch function
 */
export const patch = model => (id, payload) => {
    return new Promise((resolve, reject) => {
        get(model)(id)
            .then(user => {
                if (!user) {
                    return resolve()
                }

                assign(user, payload)

                validate(user, reject, user => {
                    user.save(err => {
                        if (err) {
                            return reject(err) //reject(boom.badRequest(err.message || err).output.payload)
                        }

                        return resolve(user)
                    })
                })
            })
            .catch(reject)
    })
}

/**
 * PUT a record on the database
 *
 * @param {Schema} model The current model
 * @returns {function(any, Object):Promise} The put function
 */
export const put = model => (id, payload) => {
    return new Promise((resolve, reject) => {
        get(model)(id)
            .then(found => {
                if (!found) {
                    return resolve()
                }

                payload.id = id
                const resource = new model(payload)

                validate(resource, reject, () => {
                    resource.save(err => {
                        if (err) {
                            return reject(
                                boom.badRequest(err.message || err).output
                                    .payload
                            ) //reject(boom.badRequest(err.message || err).output.payload)
                        }

                        return resolve(resource)
                    })
                })
            })
            .catch(reject)
    })
}

/**
 * CREATE a record on a database
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The create function
 */
export const create = model => payload => {
    return new Promise((resolve, reject) => {
        let newResource = new model(payload)
        validate(newResource, reject, user => {
            user.save(err => {
                if (err) {
                    return reject(
                        boom.badRequest(err.message || err).output.payload
                    )
                }
                return resolve(newResource.toObject()) //res.status(201);
            })
        })
    })
}

/**
 * CREATE BULK a record on a database
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The create bulk function
 */
export const createBulk = model => payload => {
    return new Promise((resolve, reject) => {
        const errors = []
        map(
            payload,
            (item, callback) => {
                const resource = new model(item)
                validate(
                    resource,
                    error => errors.push(error),
                    resource => {
                        callback(null, resource)
                    }
                )
            },
            function(err, models) {
                if (err) {
                    return reject(boom.internal(err.message, err, 500))
                }

                if (errors.length) {
                    return reject(
                        boom.badData(
                            'Invalid data provided, please verify and try again!',
                            model.errors
                        )
                    )
                }

                map(
                    models,
                    (model, callback) => {
                        model.save((err, instance) => {
                            if (err) {
                                // @todo Implement transactions instead of this horrendous thing
                                return callback(
                                    reject(boom.internal(err.message, err, 500))
                                )
                            }
                            callback(null, instance.toObject(true))
                        })
                    },
                    (err, results) => {
                        if (err) reject(err)
                        else resolve(results)
                    }
                )
            }
        )
    })
}

/**
 * Delete action, deletes a single user
 * Default mapping to DEL '~/users/:id', no GET mapping
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The destroy function
 */
export const destroy = model => user_id => {
    return new Promise((resolve, reject) => {
        model.findById(user_id, (err, user) => {
            if (err) {
                reject(err)
            }

            if (!user) {
                return resolve()
            }

            model.destroyById(user_id, err => {
                if (err) {
                    return reject(err)
                }

                return resolve()
            })
        })
    })
}

/**
 * Delete action, deletes a all users
 * Default mapping to DEL '~/users', no GET mapping
 *
 * @param {Schema} model The current model
 * @returns {function():Promise} The trucate function
 */
export const truncate = model => () => {
    return new Promise((resolve, reject) => {
        model.destroyAll(err => {
            if (err) {
                return reject(
                    boom.badRequest(err.message || err).output.payload
                )
            } else {
                resolve()
            }
        })
    })
}

/**
 * Loads all methos for a given model
 *
 * @param {object} model The model to build the repository for
 * @borrows get as get
 * @borrows list as list
 * @borrows count as count
 * @borrows empty as empty
 * @borrows create as create
 * @borrows createBulk as createBulk
 * @borrows put as put
 * @borrows patch as patch
 * @returns {object} Loaded repository
 */
export const load = model => ({
    get: get(model),
    list: list(model),
    count: count(model),
    empty: empty(model),
    create: create(model),
    createBulk: createBulk(model),
    put: put(model),
    patch: patch(model)
})
