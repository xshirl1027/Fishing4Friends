'use strict';

/**
 * Defines the RESTful API endpoints related to offerings.
 *
 * @module Offerings
 * @submodule Offerings-Server
 * @class OfferingsRoutes
 * @static
 */

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var offerings = require('../../app/controllers/offerings.server.controller');

	// Offerings Routes
	app.route('/offerings')
		.get(offerings.list)
		.post(users.requiresLogin, offerings.create);

	app.route('/offerings/:offeringId')
		.get(offerings.read)
		.put(users.requiresLogin, offerings.hasAuthorization, offerings.update)
		.delete(users.requiresLogin, offerings.hasAuthorization, offerings.delete);

	// While this route requires no authorization check to modify the offering document, the document is
	// modified by the server controller and not the client.
	app.route('/offerings/:offeringId/interested')
		.put(users.requiresLogin, offerings.addInterested);

	// Do we add an authorization middle ?
	app.route('/offerings/:offeringId/rating')
		.put(users.requiresLogin, offerings.addRating);

	// Finish by binding the Offering middleware
	app.param('offeringId', offerings.offeringByID);
};
