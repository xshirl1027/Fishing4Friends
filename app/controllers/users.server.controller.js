/**
 * Provides the Users module for the server (Express).
 *
 * @module Users
 * @submodule Users-Server
 * @requires lodash
 * @requires mongoose
 * @requires passport
 * @requires crypto
 * @main
 */

'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./users/users.authentication.server.controller'),
	require('./users/users.authorization.server.controller'),
	require('./users/users.password.server.controller'),
	require('./users/users.profile.server.controller')
);