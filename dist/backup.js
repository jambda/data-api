"use strict";

/**
 * Assume you have the following library function available
 *
 * @param {integer} id - The integer ID to look up
 * @param {function} callback - The callback invoked with the result (in CPS-style)
 *                              where first argument is any error
 *                              and second argument is the result:
 *
 *                              callback(err, []);
 * @returns {Promise} - A promise resolved with the requested user
 */
// function getUser(id, callback) {}


/**
 * Looks up the list of IDs via the REST API
 * and returns them in the same order provided
 *
 * @param {array} ids - Array of IDs in desired order
 * @param {function} callback - CPS callback you should invoke with the result
 *                            first arugment should be error (if any) and
 *                            second argument is the result
 * @return {Promise} (optional) A promise that is resolved with the ordered array of user objects (not required in your solution; if you want you can implement this way)
 */
function getUsersByIds(userIds, callback) {

  // call getUserById(id) to look up a user object

  // your result should invoice the callback with
  // the first argument as null (if no error)
  // and the second arugment as the ordered list of user objects
  callback(null, []);
}

// Example usage:
//
// getUsersByIds([1, 2, 3], function (err, users) {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log('Success:', users);
// });