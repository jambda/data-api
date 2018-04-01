'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _response = require('../helper/response');

var _repository = require('../repository');

var repository = _interopRequireWildcard(_repository);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Counts the number of records in a model
 *
 * @param {Schema} model
 * @returns {Function}
 * @private
 */
const __count = model => {
    const count = repository.count(model);

    return (req, res, next) => {
        count().then(response => {
            (0, _response.success)(200, response, res);
        }).catch(next);
    };
};

exports.default = __count;