import { success } from '../helper/response'
import { notFound } from 'boom'
import * as repository from '../repository'

/**
 * Replaces an existing record
 *
 * @param {Schema} model The current model
 * @returns {Function} An express-middleware
 * @private
 */
const __put = model => {
    const put = repository.put(model)

    return (req, res, next) => {
        put(req.params.id, req.body)
            .then(response => {
                if (!response) {
                    return next(
                        notFound(
                            `Resource with id ${req.params.id} does not exist!`
                        )
                    )
                }

                success(200, response, res)
            })
            .catch(next)
    }
}

export default __put
