'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Message = mongoose.model('Message'),
	_ = require('lodash');

/**
 * Create a Message
 */
exports.create = function(req, res) {
	var message = new Message(req.body);
	message.user = req.user;

	message.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(message);
		}
	});
};

/**
 * Show the current Message
 */
exports.read = function(req, res) {
	res.jsonp(req.message);
};

/**
 * Update a Message
 */
exports.update = function(req, res) {
	var message = req.message ;

	message = _.extend(message , req.body);

	message.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(message);
		}
	});
};

/**
 * Delete an Message
 */
exports.delete = function(req, res) {
	var message = req.message ;

	message.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(message);
		}
	});
};

/**
 * List of Messages
 */
exports.list = function(req, res) {

	var keyNames= Object.keys(req.query);
	if (keyNames.length===0){
		Message.find().sort('-created').populate('user', 'displayName').exec(function(err, Messages) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(Messages);
			}
		
		});
	}else{
		console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++',keyNames);
		if (keyNames.length===1){
			Message.find().where(keyNames[0]).equals(req.query[keyNames[0]])
			.sort('-created').populate('user', 'displayName').exec(function(err, Messages){
				if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
				} else {
					res.jsonp(Messages);
				}
			});
		}else if (keyNames.length===2){
			console.log('***************************************************8888');
			Message.find().where(keyNames[0]).equals(req.query[keyNames[0]])
			.where(keyNames[1]).equals(req.query[keyNames[1]])
			.sort('-created')
			.populate('user', 'displayName').exec(function(err, Messages){
				if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
				} else {
					res.jsonp(Messages);
				}
			});
		}
		
	}
};

/**
 * Message middleware
 */
exports.messageByID = function(req, res, next, id) { 
	Message.findById(id).populate('user', 'displayName').exec(function(err, message) {
		if (err) return next(err);
		if (! message) return next(new Error('Failed to load Message ' + id));
		req.message = message;
		next();
	});
};

/**
 * Message authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.message.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * Get total count of unread messages by user
 */
exports.countUnread = function(req, res){
	var receiverID = req.user._id;
	console.log(receiverID);
	Message.count({receiving: receiverID, read: false}, function (err, total) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(total);
			res.jsonp({Total:total});
		}
	});
 };
 
exports.clearUnread = function(req, res){
	var receiverID = req.user._id;
	Message.update({receiving: receiverID}, { $set: { read: true }}, {multi: true}, function(err){//set all read to true
		if (err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});
};