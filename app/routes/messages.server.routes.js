'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var messages = require('../../app/controllers/messages.server.controller');

	// Messages Routes
	app.route('/messages')
		.get(messages.list)
		.post(users.requiresLogin, messages.create);
	
	//needs to be defined before '/messages/:messageId'
	app.route('/messages/clear')
		.put(users.requiresLogin, messages.clearUnread);
	
	//needs to be defined before '/messages/:messageId'
	app.route('/messages/count')
		.get(users.requiresLogin, messages.countUnread);
	
	app.route('/messages/:messageId')
		.get(messages.read)
		.put(users.requiresLogin, messages.hasAuthorization, messages.update)
		.delete(users.requiresLogin, messages.hasAuthorization, messages.delete);
	
	// Finish by binding the Message middleware
	app.param('messageId', messages.messageByID);
};
