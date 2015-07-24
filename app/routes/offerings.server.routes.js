'use strict';

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

	// Finish by binding the Offering middleware
	app.param('offeringId', offerings.offeringByID);

	// added by Marc... questionable functionality
	app.param('userId', users.userByID);
};
