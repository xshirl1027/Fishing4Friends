/**
 * Provides the Offerings module for the server (Express).
 *
 * @module Offerings
 * @submodule Offerings-Server
 * @requires mongoose
 */

'use strict';

/**
 * Controller driving the server and database behaviour.
 *
 * @class OfferingsServerController
 * @static
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Offering = mongoose.model('Offering'),
	User = mongoose.model('User'),
	_ = require('lodash');


/**
 * Creates a new offering, adding it to the database, and writing it to the client.
 *
 * @method create
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.create = function(req, res) {
	req.sanitize('name').escape();
	req.sanitize('description').escape();
	console.log(req.body);
	var offering = new Offering(req.body);
	// console.log('POST request body is ',req.body);
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
 * Show the current Offering back to the client.
 *
 * @method read
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.read = function(req, res) {
	console.log('read route',req.query);
	res.jsonp(req.offering);
};


/**
 * Update an Offering and write the update back to the client.
 *
 * @method update
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.update = function(req, res) {
	req.sanitize('name').escape();
	req.sanitize('description').escape();
	
	var offering = req.offering;

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
 * Delete an Offering.
 *
 * @method delete
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.delete = function(req, res) {
	var offering = req.offering;

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
 * List of Offerings, including qualified search queries; write an array of offerings back to the client.
 *
 * @method list
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.list = function(req, res) { 
	var keyNames = Object.keys(req.query);
	var val = req.query[keyNames[0]];
	
	//error handling function
	var offeringsErr = function (err, offerings) {
		if (err) {
			return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		}
		else {
			res.jsonp(offerings);
			//console.log(offerings)
		}
	};
	
	// if no search key is specified, get full list of offerings, since no query is specified
	if (keyNames.length === 0) {
		Offering.find().sort('-created').populate('user', 'displayName').populate('offering_pic','src').exec(offeringsErr);
	}
	else{
		switch(keyNames[0]){
			case 'price': //user input
			Offering.where('price').lte(val).sort('-created').populate('offering_pic','src').exec(offeringsErr);
			break;
			
			case 'user': //not user input (user_id)
			Offering.find({'user' : val}).populate('interested', 'displayName').populate('offering_pic','src').sort('-created').exec(offeringsErr);
			break;
			
			case 'rater': //not user input (user_id)
			Offering.find({'rater': val}).populate('user', 'displayName').sort('-created').populate('offering_pic','src').exec(offeringsErr);
			break;
			
			case 'interested': //not user input (user_id)
			Offering.find({'interested': val}).populate('user', 'displayName').sort('-created').populate('offering_pic','src').exec(offeringsErr);
			break;
			
			default: //user input
			req.sanitize('input').escape();
			Offering.find({ $text: { $search: val }}).sort('-created').populate('offering_pic','src').exec(offeringsErr);
			console.log(val);
		}
	}
};


/**
 * Update an Offering to register the user's interest in purchasing it.
 * This function performs the document modification, then saves it to the database and writes the result back to the user/client.
 *
 * @method addInterested
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.addInterested = function(req, res) {
	var offering = req.offering ;
	var userId = req.user._id;

	offering.interested.push(userId);

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
 * Update an Offering to add a user's rating, and writes the result back to the user/client. 
 *
 * @method addRating
 * @param req {Object} 
 * @param res {Object} 
 * @return nothing
 */
exports.addRating = function(req, res) {
	var offering = req.offering ;
	// The req.body contains the updated offering.
	offering = _.extend(offering, req.body);

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
 * Offering middleware; obtains the offering with specified ID from the database.
 * The offering has sub-document population of the displayName for the creator, interested array, and rater array, as well as the offering's photo's source.
 * Writes an error back to the user if the offering is not found.
 *
 * @method offeringByID
 * @param req {Object} 
 * @param res {Object} 
 * @param next {Function} 
 * @param id {Number} 
 * @return nothing
 */
exports.offeringByID = function(req, res, next, id) { 
	Offering.findById(id).populate({
			path: 'user interested rater',
			select: 'displayName'
		}).populate('rating.comments').populate('offering_pic','src').exec(function(err, offering) {
		   var options = {
		        path: 'rating.comments.user',
		        model: 'User',
		        select: 'displayName'
    		};
		  		User.populate(offering, options, function(err, offering) {
				console.log('offeringByID status is ',req.params);
				if (err) return next(err);
				if (! offering) return next(new Error('Failed to load Offering ' + id));
				req.offering = offering ;
				next();
			});
    });
};


/**
 * Offering authorization middleware; checks that the logged-in user is also the offering's creator.
 * Writes an error back to the user if they lack authorization.
 *
 * @method hasAuthorization
 * @param req {Object} 
 * @param res {Object} 
 * @param next {Function} 
 * @return nothing
 */
 exports.hasAuthorization = function(req, res, next) {
	if (req.offering.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
