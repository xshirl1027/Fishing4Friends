/**
 * Provides the Photos module for the server (Express).
 *
 * @module Photos
 * @submodule Photos-Server
 * @requires mongoose
 */

'use strict';

/**
 * Controller driving the server and database behaviour.
 *
 * @class PhotosServerController
 * @static
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Photo = mongoose.model('Photo'),
	_ = require('lodash');


/**
 * Creates a new Photo, adding it to the database, and writing it to the client.
 *
 * @method create
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.create = function(req, res) {
	var photo = new Photo(req.body);
	photo.user = req.user;

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};


/**
 * Show the current Photo back to the client.
 *
 * @method read
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.read = function(req, res) {
	res.jsonp(req.photo);
};


/**
 * Update a Photo and write the update back to the client.
 *
 * @method update
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.update = function(req, res) {
	var photo = req.photo ;

	photo = _.extend(photo , req.body);

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};


/**
 * Delete a Photo.
 *
 * @method delete
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.delete = function(req, res) {
	var photo = req.photo ;

	photo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};


/**
 * Gets the full list of Photos; writes an array of Photos back to the client.
 * The array is sorted by date created in descending order, and the 'user' property is populated with the associated user's 'displayName'.
 *
 * @method list
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.list = function(req, res) { 
	Photo.find().sort('-created').populate('user', 'displayName').exec(function(err, photos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photos);
		}
	});
};


/**
 * Photo middleware; obtains the Photo with specified ID from the database.
 * The 'user' property is populated with the associated user's 'displayName'.
 * Writes an error back to the user if the Photo is not found.
 *
 * @method photoByID
 * @param req {Object} 
 * @param res {Object} 
 * @param next {Function} 
 * @param id {Number} 
 * @return nothing
 */
exports.photoByID = function(req, res, next, id) { 
	Photo.findById(id).populate('user', 'displayName').exec(function(err, photo) {
		if (err) return next(err);
		if (! photo) return next(new Error('Failed to load Photo ' + id));
		req.photo = photo ;
		next();
	});
};


/**
 * Photo authorization middleware; checks that the logged-in user is also the photo's creator.
 * Writes an error back to the user if they lack authorization.
 *
 * @method hasAuthorization
 * @param req {Object} 
 * @param res {Object} 
 * @param next {Function} 
 * @return nothing
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.photo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
