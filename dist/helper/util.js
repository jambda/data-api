'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = exports.pipe = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Pipe async functions
 *
 * @param {object} fns The fns
 * @returns {function(*=): *} The result
 */
const pipe = exports.pipe = (...fns) => x => fns.reduce((prev, f) => prev.then(f), _promise2.default.resolve(x));

/**
 * Clones an object passing the new properties
 *
 * @param {Object} object The object to clone from
 * @param {Object} newObject The new propeties for the cloned object
 * @returns {Object} The new cloned object
 */
const clone = exports.clone = (object, newObject = {}) => (0, _assign2.default)({}, (0, _cloneDeep2.default)(object), newObject);