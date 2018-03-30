import { success } from '../helper/response'
import { notFound } from 'boom'
import * as repository from '../repository'

/**
 * et one or all of the records
 * If an id is present in the url it returns that entry
 * If there is no id it returns all the entries
 *
 * @param {Schema} model The current model
 * @returns {Function} An express-middleware
 */
const __get = model => {
    const list = repository.list(model)
    const get = repository.get(model)

    return (req, res, next) => {
        const { params, query } = req
        const promise = params.id ? get(params.id, query) : list({})

        promise
            .then(response => {
                if (params.id && !response) {
                    next(notFound('Record not found!'), res)
                } else {
                    success(200, response, res)
                }
            })
            .catch(next)
    }
}

export default __get
