'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _response = require('../helper/response');

var _repository = require('../repository');

var repository = _interopRequireWildcard(_repository);

var _boom = require('boom');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Patches an existing entity
 *
 * @param {Schema} model The current model
 * @returns {Function} An express-middleware
 */
const __patch = model => {
    const patch = repository.patch(model);

    return (req, res, next) => {
        patch(req.params.id, req.body).then(response => {
            if (!response) {
                return next((0, _boom.notFound)(`Resource with id ${req.params.id} does not exist!`));
            }

            (0, _response.success)(200, response, res);
        }).catch(next);
    };
};

exports.default = __patch;