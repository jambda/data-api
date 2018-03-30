import { success } from '../helper/response'
import * as repository from '../repository'

/**
 * et one or all of the records
 * If an id is present in the url it returns that entry
 * If there is no id it returns all the entries
 *
 * @param {Schema} model The current model
 * @returns {Function} An express-middleware
 */
const __new = model => {
    const empty = repository.empty(model)

    return (req, res, next) => {
        success(200, empty(req.body), res)
    }
}

export default __new
