'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _response = require('../helper/response');

var _repository = require('../repository');

var repository = _interopRequireWildcard(_repository);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Deletes a record from the database given it's id
 *
 * @param {Schema} model The current model
 * @returns {Function} An express-middleware
 */
const __delete = model => {
    const destroy = repository.destroy(model);

    return (req, res, next) => {
        destroy(req.params.id).then(() => {
            (0, _response.success)(204, null, res);
        }).catch(next);
    };
};

exports.default = __delete;