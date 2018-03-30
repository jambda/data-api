import { success } from '../helper/response'
import * as repository from '../repository'

/**
 * Creates a new record
 *
 * @param {Schema} model The current model
 * @returns {Function} An express-middleware
 */
const __post = model => {
    const create = repository.create(model)

    return (req, res, next) => {
        create(req.body)
            .then(response => {
                success(200, response, res)
            })
            .catch(next)
    }
}

export default __post
