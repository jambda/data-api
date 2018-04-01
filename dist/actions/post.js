'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _response = require('../helper/response');

var _repository = require('../repository');

var repository = _interopRequireWildcard(_repository);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Creates a new record
 *
 * @param {Schema} model The current model
 * @returns {Function} An express-middleware
 */
const __post = model => {
    const create = repository.create(model);

    return (req, res, next) => {
        create(req.body).then(response => {
            (0, _response.success)(200, response, res);
        }).catch(next);
    };
};

exports.default = __post;