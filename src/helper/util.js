import cloneDeep from 'lodash/cloneDeep'

/**
 * Pipe async functions
 *
 * @param {object} fns The fns
 * @returns {function(*=): *} The result
 */
export const pipe = (...fns) => x =>
    fns.reduce((prev, f) => prev.then(f), Promise.resolve(x))

/**
 * Clones an object passing the new properties
 *
 * @param {Object} object The object to clone from
 * @param {Object} newObject The new propeties for the cloned object
 * @returns {Object} The new cloned object
 */
export const clone = (object, newObject = {}) =>
    Object.assign({}, cloneDeep(object), newObject)