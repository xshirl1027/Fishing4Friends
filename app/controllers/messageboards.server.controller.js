/**
 * Providing the Messageboard module for the server
 * @module Messageboard
 * @submodule Messageboard-Server
 * @requires mongoose
 */
 'use strict';
 /** Server-side Controller for Posts module responsible for reading data from and propagating changes to the database
 *@class MessageboardController
 *@static
 **/
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Messageboard = mongoose.model('Messageboard'),
	_ = require('lodash');

/** Saves the newly created messageboard to the database
 * @method create
 * @param req{object}
 * @param res{object}
 * @return nothing
 **/
exports.create = function(req, res) {
	req.sanitize('name').escape(); //escape user input
	req.sanitize('message').escape(); //escape user input
	
	var messageboard = new Messageboard(req.body);
	messageboard.user = req.user;

	messageboard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messageboard);
		}
	});
};

/**
 * Shows the current Messageboard to client
 * @method read
 * @param req{object}
 * @param res{object}
 * @return nothing
 **/
exports.read = function(req, res) {
	res.jsonp(req.messageboard);
};

/**
 * Update a Messageboard
 * @method update
 * @param req{object}
 * @param res{object}
 * @return nothing
 */
exports.update = function(req, res) {
	
	req.sanitize('name').escape(); //escape user input
	req.sanitize('message').escape(); //escape user input
	var messageboard = req.messageboard ;

	messageboard = _.extend(messageboard , req.body);

	messageboard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messageboard);
		}
	});
};

/**
 * Delete an Messageboard
 * @method delete
 * @param req{object}
 * @param res{object}
 * @return nothing
 *
 */
exports.delete = function(req, res) {
	var messageboard = req.messageboard ;

	messageboard.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messageboard);
		}
	});
};

/**
 *returns a list of all Messageboards
 *@method list
 *@param req{object}
 *@param res{object}
 *@return nothing
 *
 */
exports.list = function(req, res) {
	var keyNames = Object.keys(req.query);
	var val = req.query[keyNames[0]];
	
	var messageboardsErr = function(err, messageboards){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messageboards);
		}
	};
	
	if (keyNames.length === 0) {
		Messageboard.find().sort('-created').populate('user', 'displayName').exec(messageboardsErr);
	}
	else{
		req.sanitize('input').escape();
		Messageboard.find({ $text: { $search: val }}).sort('-created').exec(messageboardsErr);
	}
};

/**
 * Messageboard middleware
 * @method messageboardByID
 * @param req {Object} 
 * @param res {Object} 
 * @param next {Function} 
 * @param id {Number} 
 * @return nothing
 *
 */
exports.messageboardByID = function(req, res, next, id) { 
	Messageboard.findById(id).populate('user', 'displayName').exec(function(err, messageboard) {
		if (err) return next(err);
		if (! messageboard) return next(new Error('Failed to load Messageboard ' + id));
		req.messageboard = messageboard ;
		next();
	});
};

 
/**
 * Messageboard authorization middleware
  * @method hasAuthorization
 * @param req {Object} 
 * @param res {Object} 
 * @param next {Function} 
 * @return nothing
 *
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.messageboard.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
