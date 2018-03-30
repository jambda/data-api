import { success } from '../helper/response'
import * as repository from '../repository'
import { notFound } from 'boom'

/**
 * Patches an existing entity
 *
 * @param {Schema} model The current model
 * @returns {Function} An express-middleware
 */
const __patch = model => {
    const patch = repository.patch(model)

    return (req, res, next) => {
        patch(req.params.id, req.body)
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

export default __patch
