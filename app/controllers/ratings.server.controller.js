/**
 * Provides the Ratings module for the server (Express).
 *
 * @module Ratings
 * @submodule Ratings-Server
 * @requires mongoose
 */

'use strict';

/**
 * Controller driving the server and database behaviour.
 *
 * @class ServerController
 * @static
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Rating = mongoose.model('Rating'),
	_ = require('lodash');


/**
 * Creates a new Rating, adding it to the database, and writing it to the client.
 *
 * @method create
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.create = function(req, res) {
	var rating = new Rating(req.body);
	rating.user = req.user;

	rating.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rating);
		}
	});
};


/**
 * Show the current Rating back to the client.
 *
 * @method read
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.read = function(req, res) {
	res.jsonp(req.rating);
};


/**
 * Update a Rating and write the update back to the client.
 *
 * @method update
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.update = function(req, res) {
	var rating = req.rating ;

	rating = _.extend(rating , req.body);

	rating.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rating);
		}
	});
};


/**
 * Delete a Rating.
 *
 * @method delete
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.delete = function(req, res) {
	var rating = req.rating ;

	rating.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rating);
		}
	});
};


/**
 * Gets the full list of Ratings; writes an array of Ratings back to the client.
 * The array is sorted by date created in descending order, and the 'user' property is populated with the associated user's 'displayName'.
 *
 * @method list
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.list = function(req, res) { 
	Rating.find().sort('-created').populate('user', 'displayName').exec(function(err, ratings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ratings);
		}
	});
};


/**
 * Rating middleware; obtains the Rating with specified ID from the database.
 * The 'user' property is populated with the associated user's 'displayName'.
 * Writes an error back to the user if the Rating is not found.
 *
 * @method ratingByID
 * @param req {Object} 
 * @param res {Object} 
 * @param next {Function} 
 * @param id {Number} 
 * @return nothing
 */
exports.ratingByID = function(req, res, next, id) { 
	Rating.findById(id).populate('user', 'displayName').exec(function(err, rating) {
		if (err) return next(err);
		if (! rating) return next(new Error('Failed to load Rating ' + id));
		req.rating = rating ;
		next();
	});
};


/**
 * Rating authorization middleware; checks that the logged-in user is also the Rating's creator.
 * Writes an error back to the user if they lack authorization.
 *
 * @method hasAuthorization
 * @param req {Object} 
 * @param res {Object} 
 * @param next {Function} 
 * @return nothing
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.rating.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
