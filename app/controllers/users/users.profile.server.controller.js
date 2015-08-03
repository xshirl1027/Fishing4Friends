'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

exports.updaterole=function(req,res){
	console.log('does it get here +++++++++++++++++++++++===');
// Init Variables
	var user = req.user;
	var message = null;
	console.log(user);
	// For security measurement we remove the roles from the req.body object
	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		
			user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				
						res.json(user);
			}
				});
			
		
	} 
};
/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	req.sanitize('interests').escape();
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};



/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

/**
 * Show the requested User
 */
exports.read = function(req, res) {
	res.jsonp(req.other);
};

exports.list = function(req, res) { 
	User.find().select('displayName roles').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};
