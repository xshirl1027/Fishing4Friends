'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var messageboards = require('../../app/controllers/messageboards.server.controller');

	// Messageboards Routes

	app.route('/messageboards')
		.get(messageboards.list)
		.post(users.requiresLogin, messageboards.create);

	app.route('/messageboards/:messageboardId')
		.get(messageboards.read)
		.put(users.requiresLogin, messageboards.hasAuthorization, messageboards.update)
		.delete(users.requiresLogin, messageboards.hasAuthorization, messageboards.delete);
	

	// Finish by binding the Messageboard middleware
	app.param('messageboardId', messageboards.messageboardByID);
};
