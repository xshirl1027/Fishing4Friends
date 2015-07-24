'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Offering = mongoose.model('Offering'),
	_ = require('lodash');

/**
 * Create a Offering
 */
exports.create = function(req, res) {
	var offering = new Offering(req.body);
	console.log('POST request body is ',req.body);
	console.log('POST request body.id is ',req.body._id);
	offering.user = req.user;

	offering.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offering);
		}
	});
};

/**
 * Show the current Offering
 */
exports.read = function(req, res) {
	console.log(req.query);
	res.jsonp(req.offering);
};

/**
 * Update a Offering
 */
exports.update = function(req, res) {
	var offering = req.offering ;
	console.log('PUT request body is ',req.body);
	console.log('PUT request body.id is ',req.body._id);

	offering = _.extend(offering , req.body);

	offering.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offering);
		}
	});
};

/**
 * Delete an Offering
 */
exports.delete = function(req, res) {
	var offering = req.offering ;

	offering.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offering);
		}
	});
};

/**
 * List of Offerings
 */
exports.list = function(req, res) { 
	console.log(req.query);
	var keyNames = Object.keys(req.query);
	// if no search key is specified, get full list of offerings, since no query is specified
	if (keyNames.length === 0) {
		Offering.find().sort('-created').populate('user', 'displayName').exec(function(err, offerings) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(offerings);
			}
		});
	}
	// search the list of offerings with the first key:value pair in the query
	else {
		Offering.find().where(keyNames[0]).equals(req.query[keyNames[0]]).sort('-created').exec(function(err, offerings) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(offerings);
			}
		});
	}
};

/**
 * List of Offerings by this User
 * added by Marc
 */
exports.listByUser = function(req, res) { 
	Offering.find().where('user').equals(req.user).sort('-created').exec(function(err, offerings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offerings);
		}
	});
};

/**
 * Offering middleware
 */
exports.offeringByID = function(req, res, next, id) { 
	Offering.findById(id).populate('user', 'displayName').exec(function(err, offering) {
		if (err) return next(err);
		if (! offering) return next(new Error('Failed to load Offering ' + id));
		req.offering = offering ;
		next();
	});
};

/**
 * Offering authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.offering.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
