import { success } from '../../helper/response'
import * as repository from '../../repository'

/**
 * Creates a multiple records
 *
 * @param {Schema} model The current model
 * @returns {Function} An express-middleware
 */
const __postBulk = model => {
    const create = repository.createBulk(model)

    return (req, res, next) => {
        create(req.body)
            .then(response => {
                success(200, response, res)
            })
            .catch(next)
    }
}

export default __postBulk
