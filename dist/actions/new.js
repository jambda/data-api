'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _response = require('../helper/response');

var _repository = require('../repository');

var repository = _interopRequireWildcard(_repository);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * et one or all of the records
 * If an id is present in the url it returns that entry
 * If there is no id it returns all the entries
 *
 * @param {Schema} model The current model
 * @returns {Function} An express-middleware
 */
const __new = model => {
    const empty = repository.empty(model);

    return (req, res, next) => {
        (0, _response.success)(200, empty(req.body), res);
    };
};

exports.default = __new;