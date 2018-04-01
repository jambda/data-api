/**
 * Builds a success response message
 *
 * @param {number} code The http response code
 * @param {object} response The response to be sent to the user
 * @param {object} context The request context
 * @returns {object} {{headers: {Content-Type}, statusCode: *, body}}
 */
const success = (code, response, context) => {
    __headers(context)
    return context.status(code).json(response)
}

/**
 * Private method to get the response headers
 *
 * @param {Object} context The request context
 * @returns {Object} The request context
 * @private
 */
const __headers = context => {
    context.set('Content-Type', 'application/json')
    return context
}

export { success }
